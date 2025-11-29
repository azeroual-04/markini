import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string;

    @Column()
    serviceName: string;

    @Column()
    action: string;

    @Column()
    resourceType: string;

    @Column({ nullable: true })
    resourceId: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ type: 'text', nullable: true })
    userAgent: string;

    @Column({ type: 'jsonb', nullable: true })
    requestPayload: any;

    @Column({ nullable: true })
    responseStatus: number;

    @CreateDateColumn()
    timestamp: Date;
}
