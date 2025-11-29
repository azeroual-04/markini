import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, MedicalHistory } from './entities/patient.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Patient, MedicalHistory])],
    controllers: [PatientController],
    providers: [PatientService],
    exports: [PatientService],
})
export class PatientModule { }
