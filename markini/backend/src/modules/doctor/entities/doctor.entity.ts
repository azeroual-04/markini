import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'text', array: true })
    specialization: string[];

    @Column({ unique: true })
    licenseNumber: string;

    @Column()
    yearsOfExperience: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    consultationFee: number;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    profileImageUrl: string;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    rating: number;

    @Column({ default: 0 })
    totalReviews: number;

    @Column({ type: 'jsonb', nullable: true })
    clinicAddress: any;

    @Column({ type: 'text', array: true, default: [] })
    acceptedInsurance: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('doctor_availability')
export class DoctorAvailability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    doctorId: string;

    @Column({ type: 'int' })
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'int', default: 30 })
    slotDuration: number; // in minutes

    @Column({ default: true })
    isAvailable: boolean;
}

@Entity('doctor_reviews')
export class DoctorReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    doctorId: string;

    @Column()
    patientId: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn()
    createdAt: Date;
}
