import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, MedicalHistory } from './entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto, CreateMedicalHistoryDto } from './dto/patient.dto';
import { KafkaService, KafkaTopics } from '../../common/kafka/kafka.service';

/**
 * Patient service
 * Handles patient profile and medical history management
 */
@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private patientRepository: Repository<Patient>,
        @InjectRepository(MedicalHistory)
        private medicalHistoryRepository: Repository<MedicalHistory>,
        private kafkaService: KafkaService,
    ) { }

    async create(createPatientDto: CreatePatientDto): Promise<Patient> {
        const patient = this.patientRepository.create(createPatientDto);
        const savedPatient = await this.patientRepository.save(patient);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.PATIENT_EVENTS, {
            type: 'patient.created',
            id: savedPatient.id,
            data: savedPatient,
        });

        return savedPatient;
    }

    async findAll(): Promise<Patient[]> {
        return this.patientRepository.find({ relations: ['user'] });
    }

    async findOne(id: string): Promise<Patient> {
        const patient = await this.patientRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }

        return patient;
    }

    async findByUserId(userId: string): Promise<Patient> {
        const patient = await this.patientRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!patient) {
            throw new NotFoundException(`Patient not found for user ${userId}`);
        }

        return patient;
    }

    async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
        const patient = await this.findOne(id);
        Object.assign(patient, updatePatientDto);
        const updatedPatient = await this.patientRepository.save(patient);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.PATIENT_EVENTS, {
            type: 'patient.updated',
            id: updatedPatient.id,
            data: updatedPatient,
        });

        return updatedPatient;
    }

    async remove(id: string): Promise<void> {
        const patient = await this.findOne(id);
        await this.patientRepository.remove(patient);

        // Publish event
        await this.kafkaService.publishEvent(KafkaTopics.PATIENT_EVENTS, {
            type: 'patient.deleted',
            id,
        });
    }

    async getMedicalHistory(patientId: string): Promise<MedicalHistory[]> {
        return this.medicalHistoryRepository.find({
            where: { patientId },
            order: { diagnosisDate: 'DESC' },
        });
    }

    async addMedicalHistory(
        patientId: string,
        createMedicalHistoryDto: CreateMedicalHistoryDto,
    ): Promise<MedicalHistory> {
        const patient = await this.findOne(patientId);

        const medicalHistory = this.medicalHistoryRepository.create({
            ...createMedicalHistoryDto,
            patientId: patient.id,
        });

        return this.medicalHistoryRepository.save(medicalHistory);
    }
}
