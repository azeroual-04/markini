import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';

/**
 * Kafka module
 * Provides event-driven messaging capabilities
 */
@Global()
@Module({
    imports: [ConfigModule],
    providers: [KafkaService],
    exports: [KafkaService],
})
export class KafkaModule { }
