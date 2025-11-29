import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Configuration
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { kafkaConfig } from './config/kafka.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patient/patient.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TeleconsultationModule } from './modules/teleconsultation/teleconsultation.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditModule } from './modules/audit/audit.module';

// Common
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { KafkaModule } from './common/kafka/kafka.module';

/**
 * Root application module
 * Imports all feature modules and configures global services
 */
@Module({
    imports: [
        // Configuration module - loads environment variables
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, redisConfig, kafkaConfig],
            envFilePath: '.env',
        }),

        // Database module - TypeORM configuration
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('database.synchronize'),
                logging: configService.get('database.logging'),
                migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                migrationsRun: false,
            }),
            inject: [ConfigService],
        }),

        // Schedule module for cron jobs (appointment reminders, etc.)
        ScheduleModule.forRoot(),

        // Event emitter for internal events
        EventEmitterModule.forRoot(),

        // Database module
        DatabaseModule,

        // Redis module for caching and session management
        RedisModule,

        // Kafka module for event-driven architecture
        KafkaModule,

        // Feature modules
        AuthModule,
        PatientModule,
        DoctorModule,
        AppointmentModule,
        PaymentModule,
        TeleconsultationModule,
        NotificationModule,
        AuditModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
