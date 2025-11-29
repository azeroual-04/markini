import { registerAs } from '@nestjs/config';

/**
 * Redis configuration
 * Loads Redis connection settings from environment variables
 */
export const redisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
}));
