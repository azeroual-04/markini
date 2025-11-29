import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

/**
 * Kafka service
 * Handles event publishing and consuming for microservices communication
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Map<string, Consumer> = new Map();

    constructor(private configService: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.configService.get('kafka.clientId'),
            brokers: this.configService.get('kafka.brokers'),
        });

        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        console.log('✅ Kafka producer connected');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();

        // Disconnect all consumers
        for (const [topic, consumer] of this.consumers.entries()) {
            await consumer.disconnect();
        }
    }

    /**
     * Publish event to Kafka topic
     */
    async publishEvent(topic: string, event: any): Promise<void> {
        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key: event.id || Date.now().toString(),
                        value: JSON.stringify(event),
                        timestamp: Date.now().toString(),
                    },
                ],
            });
            console.log(`📤 Event published to ${topic}:`, event.type || 'event');
        } catch (error) {
            console.error(`❌ Failed to publish event to ${topic}:`, error);
            throw error;
        }
    }

    /**
     * Subscribe to Kafka topic and process messages
     */
    async subscribe(
        topic: string,
        groupId: string,
        handler: (payload: EachMessagePayload) => Promise<void>,
    ): Promise<void> {
        const consumer = this.kafka.consumer({ groupId });

        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
            eachMessage: async (payload) => {
                try {
                    await handler(payload);
                } catch (error) {
                    console.error(`❌ Error processing message from ${topic}:`, error);
                }
            },
        });

        this.consumers.set(topic, consumer);
        console.log(`✅ Subscribed to topic: ${topic} with group: ${groupId}`);
    }

    /**
     * Publish multiple events in batch
     */
    async publishBatch(topic: string, events: any[]): Promise<void> {
        try {
            await this.producer.send({
                topic,
                messages: events.map((event) => ({
                    key: event.id || Date.now().toString(),
                    value: JSON.stringify(event),
                    timestamp: Date.now().toString(),
                })),
            });
            console.log(`📤 Batch of ${events.length} events published to ${topic}`);
        } catch (error) {
            console.error(`❌ Failed to publish batch to ${topic}:`, error);
            throw error;
        }
    }
}

/**
 * Kafka event topics
 */
export enum KafkaTopics {
    PATIENT_EVENTS = 'patient-events',
    DOCTOR_EVENTS = 'doctor-events',
    APPOINTMENT_EVENTS = 'appointment-events',
    PAYMENT_EVENTS = 'payment-events',
    NOTIFICATION_EVENTS = 'notification-events',
    AUDIT_EVENTS = 'audit-events',
}
