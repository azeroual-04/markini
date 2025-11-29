import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

/**
 * Authentication service
 * Handles user authentication, JWT tokens, and 2FA
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Register a new user
     */
    async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
        const { email, password, role } = registerDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            role,
        });

        await this.userRepository.save(user);

        // Generate access token
        const accessToken = this.generateAccessToken(user);

        // Remove password from response
        delete user.password;

        return { user, accessToken };
    }

    /**
     * Login user
     */
    async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
        const { email, password, mfaCode } = loginDto;

        // Find user
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if MFA is enabled
        if (user.mfaEnabled) {
            if (!mfaCode) {
                throw new UnauthorizedException('MFA code required');
            }

            const isMfaValid = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaCode,
            });

            if (!isMfaValid) {
                throw new UnauthorizedException('Invalid MFA code');
            }
        }

        // Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // Save refresh token
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.save(user);

        // Remove sensitive data
        delete user.password;
        delete user.mfaSecret;
        delete user.refreshToken;

        return { user, accessToken, refreshToken };
    }

    /**
     * Enable 2FA for user
     */
    async enableMfa(userId: string): Promise<{ secret: string; qrCode: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `${this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME')} (${user.email})`,
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        // Save secret
        user.mfaSecret = secret.base32;
        await this.userRepository.save(user);

        return { secret: secret.base32, qrCode };
    }

    /**
     * Verify and activate MFA
     */
    async verifyMfa(userId: string, code: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.mfaSecret) {
            throw new BadRequestException('MFA not set up');
        }

        const isValid = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: code,
        });

        if (isValid) {
            user.mfaEnabled = true;
            await this.userRepository.save(user);
        }

        return isValid;
    }

    /**
     * Disable MFA
     */
    async disableMfa(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        user.mfaEnabled = false;
        user.mfaSecret = null;
        await this.userRepository.save(user);
    }

    /**
     * Request password reset
     */
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const { email } = forgotPasswordDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (user) {
            // Generate reset token
            const resetToken = uuidv4();
            user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

            await this.userRepository.save(user);

            // TODO: Send email with reset token
            console.log(`Password reset token for ${email}: ${resetToken}`);
        }

        // Always return success to prevent email enumeration
    }

    /**
     * Reset password
     */
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
        const { token, newPassword } = resetPasswordDto;

        const users = await this.userRepository.find({
            where: { resetPasswordExpires: { $gte: new Date() } as any },
        });

        let user: User | null = null;
        for (const u of users) {
            if (u.resetPasswordToken && await bcrypt.compare(token, u.resetPasswordToken)) {
                user = u;
                break;
            }
        }

        if (!user) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await this.userRepository.save(user);
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user || !user.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Verify refresh token
            const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isValid) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Generate new tokens
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            // Update refresh token
            user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
            await this.userRepository.save(user);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    /**
     * Logout user
     */
    async logout(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.refreshToken = null;
            await this.userRepository.save(user);
        }
    }

    /**
     * Validate user by ID
     */
    async validateUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    /**
     * Generate JWT access token
     */
    private generateAccessToken(user: User): string {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION'),
        });
    }

    /**
     * Generate JWT refresh token
     */
    private generateRefreshToken(user: User): string {
        const payload = { sub: user.id };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        });
    }
}
