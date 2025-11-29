import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit.entity';

/**
 * Audit module
 * Handles logging and auditing for compliance
 */
@Module({
    imports: [TypeOrmModule.forFeature([AuditLog])],
    controllers: [],
    providers: [],
    exports: [],
})
export class AuditModule { }
