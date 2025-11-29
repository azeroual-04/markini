import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

/**
 * User entity
 * Stores authentication and user role information
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['patient', 'doctor', 'admin'],
    })
    role: 'patient' | 'doctor' | 'admin';

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: false })
    mfaEnabled: boolean;

    @Column({ nullable: true })
    mfaSecret: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    resetPasswordExpires: Date;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
