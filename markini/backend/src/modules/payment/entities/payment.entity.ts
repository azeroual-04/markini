import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    appointmentId: string;

    @Column()
    patientId: string;

    @Column()
    doctorId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'usd' })
    currency: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    })
    status: string;

    @Column()
    paymentMethod: string;

    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    stripePaymentIntentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
