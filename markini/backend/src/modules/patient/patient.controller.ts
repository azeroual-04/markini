import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto, CreateMedicalHistoryDto } from './dto/patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Post()
    @ApiOperation({ summary: 'Create patient profile' })
    create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientService.create(createPatientDto);
    }

    @Get()
    @Roles('admin')
    @ApiOperation({ summary: 'Get all patients (Admin only)' })
    findAll() {
        return this.patientService.findAll();
    }

    @Get('me')
    @Roles('patient')
    @ApiOperation({ summary: 'Get current patient profile' })
    getMyProfile(@Request() req) {
        return this.patientService.findByUserId(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get patient by ID' })
    findOne(@Param('id') id: string) {
        return this.patientService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update patient profile' })
    update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientService.update(id, updatePatientDto);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete patient (Admin only)' })
    remove(@Param('id') id: string) {
        return this.patientService.remove(id);
    }

    @Get(':id/medical-history')
    @ApiOperation({ summary: 'Get patient medical history' })
    getMedicalHistory(@Param('id') id: string) {
        return this.patientService.getMedicalHistory(id);
    }

    @Post(':id/medical-history')
    @Roles('doctor', 'admin')
    @ApiOperation({ summary: 'Add medical history entry' })
    addMedicalHistory(
        @Param('id') id: string,
        @Body() createMedicalHistoryDto: CreateMedicalHistoryDto,
    ) {
        return this.patientService.addMedicalHistory(id, createMedicalHistoryDto);
    }
}
