import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorAvailability, DoctorReview } from './entities/doctor.entity';
import { KafkaService, KafkaTopics } from '../../common/kafka/kafka.service';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor)
        private doctorRepository: Repository<Doctor>,
        @InjectRepository(DoctorAvailability)
        private availabilityRepository: Repository<DoctorAvailability>,
        @InjectRepository(DoctorReview)
        private reviewRepository: Repository<DoctorReview>,
        private kafkaService: KafkaService,
    ) { }

    async create(createDoctorDto: any): Promise<Doctor> {
        const doctor = this.doctorRepository.create(createDoctorDto);
        const savedDoctor = await this.doctorRepository.save(doctor);

        await this.kafkaService.publishEvent(KafkaTopics.DOCTOR_EVENTS, {
            type: 'doctor.created',
            id: savedDoctor.id,
            data: savedDoctor,
        });

        return savedDoctor;
    }

    async findAll(filters?: any): Promise<Doctor[]> {
        const query = this.doctorRepository.createQueryBuilder('doctor');

        if (filters?.specialization) {
            query.andWhere(':specialization = ANY(doctor.specialization)', {
                specialization: filters.specialization,
            });
        }

        if (filters?.minRating) {
            query.andWhere('doctor.rating >= :minRating', { minRating: filters.minRating });
        }

        return query.getMany();
    }

    async findOne(id: string): Promise<Doctor> {
        const doctor = await this.doctorRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!doctor) {
            throw new NotFoundException(`Doctor with ID ${id} not found`);
        }

        return doctor;
    }

    async update(id: string, updateDoctorDto: any): Promise<Doctor> {
        const doctor = await this.findOne(id);
        Object.assign(doctor, updateDoctorDto);
        return this.doctorRepository.save(doctor);
    }

    async getAvailability(doctorId: string): Promise<DoctorAvailability[]> {
        return this.availabilityRepository.find({
            where: { doctorId },
            order: { dayOfWeek: 'ASC', startTime: 'ASC' },
        });
    }

    async setAvailability(doctorId: string, availability: any[]): Promise<DoctorAvailability[]> {
        // Delete existing availability
        await this.availabilityRepository.delete({ doctorId });

        // Create new availability
        const availabilityEntities = availability.map((slot) =>
            this.availabilityRepository.create({ ...slot, doctorId }),
        );

        const saved = await this.availabilityRepository.save(availabilityEntities);

        await this.kafkaService.publishEvent(KafkaTopics.DOCTOR_EVENTS, {
            type: 'doctor.availability.updated',
            id: doctorId,
        });

        return saved;
    }

    async getReviews(doctorId: string): Promise<DoctorReview[]> {
        return this.reviewRepository.find({
            where: { doctorId },
            order: { createdAt: 'DESC' },
        });
    }

    async addReview(doctorId: string, patientId: string, rating: number, comment: string): Promise<DoctorReview> {
        const review = this.reviewRepository.create({
            doctorId,
            patientId,
            rating,
            comment,
        });

        const savedReview = await this.reviewRepository.save(review);

        // Update doctor rating
        await this.updateDoctorRating(doctorId);

        await this.kafkaService.publishEvent(KafkaTopics.DOCTOR_EVENTS, {
            type: 'doctor.reviewed',
            id: doctorId,
            data: savedReview,
        });

        return savedReview;
    }

    private async updateDoctorRating(doctorId: string): Promise<void> {
        const reviews = await this.reviewRepository.find({ where: { doctorId } });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await this.doctorRepository.update(doctorId, {
            rating: avgRating,
            totalReviews: reviews.length,
        });
    }
}
