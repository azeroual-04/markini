import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    RegisterDto,
    LoginDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    VerifyMfaDto,
    RefreshTokenDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Authentication controller
 * Handles all authentication-related endpoints
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    async logout(@Request() req) {
        await this.authService.logout(req.user.userId);
        return { message: 'Logged out successfully' };
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset email sent' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto);
        return { message: 'If the email exists, a reset link has been sent' };
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return { message: 'Password reset successfully' };
    }

    @Post('mfa/enable')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Enable 2FA' })
    @ApiResponse({ status: 200, description: '2FA setup initiated' })
    async enableMfa(@Request() req) {
        return this.authService.enableMfa(req.user.userId);
    }

    @Post('mfa/verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify and activate 2FA' })
    @ApiResponse({ status: 200, description: '2FA activated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid code' })
    async verifyMfa(@Request() req, @Body() verifyMfaDto: VerifyMfaDto) {
        const isValid = await this.authService.verifyMfa(req.user.userId, verifyMfaDto.code);
        return { success: isValid, message: isValid ? '2FA enabled successfully' : 'Invalid code' };
    }

    @Post('mfa/disable')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({ status: 200, description: '2FA disabled successfully' })
    async disableMfa(@Request() req) {
        await this.authService.disableMfa(req.user.userId);
        return { message: '2FA disabled successfully' };
    }

    @Get('validate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Validate JWT token' })
    @ApiResponse({ status: 200, description: 'Token is valid' })
    async validateToken(@Request() req) {
        return { valid: true, user: req.user };
    }
}
