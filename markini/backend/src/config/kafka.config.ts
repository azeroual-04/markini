import { registerAs } from '@nestjs/config';

/**
 * Kafka configuration
 * Loads Kafka broker settings from environment variables
 */
export const kafkaConfig = registerAs('kafka', () => ({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'markini-backend',
    groupId: process.env.KAFKA_GROUP_ID || 'markini-group',
}));
