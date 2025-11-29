import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user registration
 */
export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'SecurePassword123!' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'patient', enum: ['patient', 'doctor', 'admin'] })
    @IsEnum(['patient', 'doctor', 'admin'])
    role: 'patient' | 'doctor' | 'admin';
}

/**
 * DTO for user login
 */
export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'SecurePassword123!' })
    @IsString()
    password: string;

    @ApiProperty({ example: '123456', required: false })
    @IsOptional()
    @IsString()
    mfaCode?: string;
}

/**
 * DTO for password reset request
 */
export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}

/**
 * DTO for password reset
 */
export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}

/**
 * DTO for MFA verification
 */
export class VerifyMfaDto {
    @ApiProperty({ example: '123456' })
    @IsString()
    code: string;
}

/**
 * DTO for refresh token
 */
export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
