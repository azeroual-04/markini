import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeleconsultationSession } from './entities/teleconsultation.entity';

/**
 * Teleconsultation module
 * Handles video consultation sessions with Agora
 */
@Module({
    imports: [TypeOrmModule.forFeature([TeleconsultationSession])],
    controllers: [],
    providers: [],
    exports: [],
})
export class TeleconsultationModule { }
