import { IsString, IsDateString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    address?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    insuranceInfo?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    allergies?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    medications?: string[];
}

export class UpdatePatientDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    address?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    insuranceInfo?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    allergies?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    medications?: string[];
}

export class CreateMedicalHistoryDto {
    @ApiProperty()
    @IsString()
    condition: string;

    @ApiProperty()
    @IsDateString()
    diagnosisDate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    treatment?: string;
}
