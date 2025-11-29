import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * Patient entity
 * Stores patient profile and medical information
 */
@Entity('patients')
export class Patient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'date' })
    dateOfBirth: Date;

    @Column()
    gender: string;

    @Column()
    phone: string;

    @Column({ type: 'jsonb', nullable: true })
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    insuranceInfo: {
        provider: string;
        policyNumber: string;
        groupNumber: string;
    };

    @Column({ nullable: true })
    emergencyContact: string;

    @Column({ nullable: true })
    emergencyPhone: string;

    @Column({ type: 'text', array: true, default: [] })
    allergies: string[];

    @Column({ type: 'text', array: true, default: [] })
    medications: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

/**
 * Medical history entity
 */
@Entity('medical_history')
export class MedicalHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patientId: string;

    @Column()
    condition: string;

    @Column({ type: 'date' })
    diagnosisDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'text', nullable: true })
    treatment: string;

    @CreateDateColumn()
    createdAt: Date;
}
