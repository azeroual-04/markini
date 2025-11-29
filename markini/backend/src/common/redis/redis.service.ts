import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis service
 * Provides methods for caching, session management, and distributed locking
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        this.client = new Redis({
            host: this.configService.get('redis.host'),
            port: this.configService.get('redis.port'),
            password: this.configService.get('redis.password'),
            db: this.configService.get('redis.db'),
        });

        this.client.on('connect', () => {
            console.log('✅ Redis connected successfully');
        });

        this.client.on('error', (error) => {
            console.error('❌ Redis connection error:', error);
        });
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    /**
     * Get value by key
     */
    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    /**
     * Set value with optional TTL (in seconds)
     */
    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    /**
     * Delete key
     */
    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    /**
     * Acquire distributed lock
     * Returns true if lock acquired, false otherwise
     */
    async acquireLock(
        lockKey: string,
        ttl: number = 30,
    ): Promise<boolean> {
        const result = await this.client.set(lockKey, '1', 'EX', ttl, 'NX');
        return result === 'OK';
    }

    /**
     * Release distributed lock
     */
    async releaseLock(lockKey: string): Promise<void> {
        await this.client.del(lockKey);
    }

    /**
     * Get all keys matching pattern
     */
    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    /**
     * Set hash field
     */
    async hset(key: string, field: string, value: string): Promise<void> {
        await this.client.hset(key, field, value);
    }

    /**
     * Get hash field
     */
    async hget(key: string, field: string): Promise<string | null> {
        return this.client.hget(key, field);
    }

    /**
     * Get all hash fields
     */
    async hgetall(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }

    /**
     * Increment value
     */
    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    /**
     * Get Redis client for advanced operations
     */
    getClient(): Redis {
        return this.client;
    }
}
