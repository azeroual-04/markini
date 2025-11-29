import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Doctor, DoctorAvailability, DoctorReview } from './entities/doctor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Doctor, DoctorAvailability, DoctorReview])],
    controllers: [DoctorController],
    providers: [DoctorService],
    exports: [DoctorService],
})
export class DoctorModule { }
