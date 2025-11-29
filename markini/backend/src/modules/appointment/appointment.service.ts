import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { RedisService } from '../../common/redis/redis.service';
import { KafkaService, KafkaTopics } from '../../common/kafka/kafka.service';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        private redisService: RedisService,
        private kafkaService: KafkaService,
    ) { }

    async create(createAppointmentDto: any): Promise<Appointment> {
        const { doctorId, appointmentDate, startTime, endTime } = createAppointmentDto;

        // Create lock key for slot
        const lockKey = `appointment:lock:${doctorId}:${appointmentDate}:${startTime}`;

        // Try to acquire lock
        const lockAcquired = await this.redisService.acquireLock(lockKey, 30);
        if (!lockAcquired) {
            throw new BadRequestException('This time slot is currently being booked');
        }

        try {
            // Check if slot is already booked
            const existingAppointment = await this.appointmentRepository.findOne({
                where: {
                    doctorId,
                    appointmentDate,
                    startTime,
                    status: 'scheduled' as any,
                },
            });

            if (existingAppointment) {
                throw new BadRequestException('This time slot is already booked');
            }

            // Create appointment
            const appointment = this.appointmentRepository.create(createAppointmentDto);
            const savedAppointment = await this.appointmentRepository.save(appointment);

            // Publish event
            await this.kafkaService.publishEvent(KafkaTopics.APPOINTMENT_EVENTS, {
                type: 'appointment.created',
                id: savedAppointment.id,
                data: savedAppointment,
            });

            return savedAppointment;
        } finally {
            // Release lock
            await this.redisService.releaseLock(lockKey);
        }
    }

    async findAll(filters?: any): Promise<Appointment[]> {
        const query = this.appointmentRepository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor');

        if (filters?.patientId) {
            query.andWhere('appointment.patientId = :patientId', { patientId: filters.patientId });
        }

        if (filters?.doctorId) {
            query.andWhere('appointment.doctorId = :doctorId', { doctorId: filters.doctorId });
        }

        if (filters?.status) {
            query.andWhere('appointment.status = :status', { status: filters.status });
        }

        if (filters?.date) {
            query.andWhere('appointment.appointmentDate = :date', { date: filters.date });
        }

        return query.orderBy('appointment.appointmentDate', 'ASC')
            .addOrderBy('appointment.startTime', 'ASC')
            .getMany();
    }

    async findOne(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'doctor'],
        });

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }

        return appointment;
    }

    async update(id: string, updateAppointmentDto: any): Promise<Appointment> {
        const appointment = await this.findOne(id);
        Object.assign(appointment, updateAppointmentDto);
        return this.appointmentRepository.save(appointment);
    }

    async cancel(id: string, reason: string): Promise<Appointment> {
        const appointment = await this.findOne(id);

        if (appointment.status === 'cancelled') {
            throw new BadRequestException('Appointment is already cancelled');
        }

        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;
        const updatedAppointment = await this.appointmentRepository.save(appointment);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.APPOINTMENT_EVENTS, {
            type: 'appointment.cancelled',
            id: updatedAppointment.id,
            data: updatedAppointment,
        });

        return updatedAppointment;
    }

    async confirm(id: string): Promise<Appointment> {
        const appointment = await this.findOne(id);
        appointment.status = 'confirmed';
        const updatedAppointment = await this.appointmentRepository.save(appointment);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.APPOINTMENT_EVENTS, {
            type: 'appointment.confirmed',
            id: updatedAppointment.id,
            data: updatedAppointment,
        });

        return updatedAppointment;
    }

    async complete(id: string): Promise<Appointment> {
        const appointment = await this.findOne(id);
        appointment.status = 'completed';
        const updatedAppointment = await this.appointmentRepository.save(appointment);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.APPOINTMENT_EVENTS, {
            type: 'appointment.completed',
            id: updatedAppointment.id,
            data: updatedAppointment,
        });

        return updatedAppointment;
    }

    async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
        // This would integrate with doctor availability and existing appointments
        // For now, returning a simple implementation
        const bookedSlots = await this.appointmentRepository.find({
            where: {
                doctorId,
                appointmentDate: date as any,
                status: 'scheduled' as any,
            },
            select: ['startTime'],
        });

        const bookedTimes = bookedSlots.map(slot => slot.startTime);

        // Generate all possible slots (9 AM to 5 PM, 30-minute intervals)
        const allSlots: string[] = [];
        for (let hour = 9; hour < 17; hour++) {
            allSlots.push(`${hour.toString().padStart(2, '0')}:00:00`);
            allSlots.push(`${hour.toString().padStart(2, '0')}:30:00`);
        }

        // Filter out booked slots
        return allSlots.filter(slot => !bookedTimes.includes(slot));
    }
}
