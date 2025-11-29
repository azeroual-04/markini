import { registerAs } from '@nestjs/config';

/**
 * Database configuration
 * Loads PostgreSQL connection settings from environment variables
 */
export const databaseConfig = registerAs('database', () => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'markini',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'markini_db',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
}));
