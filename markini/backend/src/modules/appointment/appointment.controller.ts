import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
    @ApiOperation({ summary: 'Book an appointment' })
    create(@Body() createAppointmentDto: any) {
        return this.appointmentService.create(createAppointmentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get appointments with filters' })
    findAll(@Query() filters: any) {
        return this.appointmentService.findAll(filters);
    }

    @Get('slots/available')
    @ApiOperation({ summary: 'Get available time slots' })
    getAvailableSlots(@Query('doctorId') doctorId: string, @Query('date') date: string) {
        return this.appointmentService.getAvailableSlots(doctorId, date);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get appointment by ID' })
    findOne(@Param('id') id: string) {
        return this.appointmentService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update appointment' })
    update(@Param('id') id: string, @Body() updateAppointmentDto: any) {
        return this.appointmentService.update(id, updateAppointmentDto);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel appointment' })
    cancel(@Param('id') id: string, @Body() body: { reason: string }) {
        return this.appointmentService.cancel(id, body.reason);
    }

    @Post(':id/confirm')
    @ApiOperation({ summary: 'Confirm appointment' })
    confirm(@Param('id') id: string) {
        return this.appointmentService.confirm(id);
    }

    @Post(':id/complete')
    @ApiOperation({ summary: 'Mark appointment as completed' })
    complete(@Param('id') id: string) {
        return this.appointmentService.complete(id);
    }
}
