import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create doctor profile' })
    create(@Body() createDoctorDto: any) {
        return this.doctorService.create(createDoctorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Search doctors' })
    findAll(@Query() filters: any) {
        return this.doctorService.findAll(filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get doctor by ID' })
    findOne(@Param('id') id: string) {
        return this.doctorService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('doctor', 'admin')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update doctor profile' })
    update(@Param('id') id: string, @Body() updateDoctorDto: any) {
        return this.doctorService.update(id, updateDoctorDto);
    }

    @Get(':id/availability')
    @ApiOperation({ summary: 'Get doctor availability' })
    getAvailability(@Param('id') id: string) {
        return this.doctorService.getAvailability(id);
    }

    @Post(':id/availability')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('doctor', 'admin')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Set doctor availability' })
    setAvailability(@Param('id') id: string, @Body() availability: any[]) {
        return this.doctorService.setAvailability(id, availability);
    }

    @Get(':id/reviews')
    @ApiOperation({ summary: 'Get doctor reviews' })
    getReviews(@Param('id') id: string) {
        return this.doctorService.getReviews(id);
    }

    @Post(':id/reviews')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Add doctor review' })
    addReview(@Param('id') id: string, @Body() reviewDto: any) {
        return this.doctorService.addReview(id, reviewDto.patientId, reviewDto.rating, reviewDto.comment);
    }
}
