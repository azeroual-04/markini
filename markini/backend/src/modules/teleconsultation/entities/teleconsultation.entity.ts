import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('teleconsultation_sessions')
export class TeleconsultationSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    appointmentId: string;

    @Column({ unique: true })
    roomId: string;

    @Column({ nullable: true })
    agoraToken: string;

    @Column({ nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    endedAt: Date;

    @Column({ nullable: true })
    duration: number; // in minutes

    @Column({ nullable: true })
    recordingUrl: string;

    @Column({
        type: 'enum',
        enum: ['scheduled', 'active', 'completed', 'failed'],
        default: 'scheduled',
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
