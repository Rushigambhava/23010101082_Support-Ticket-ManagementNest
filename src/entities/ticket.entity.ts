import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tickets' })
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column('text')
    description: string;

    @Column({ type: 'enum', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' })
    status: string;

    @Column({ type: 'enum', enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' })
    priority: string;

    @Column({ name: 'created_by' })
    created_by: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @Column({ name: 'assigned_to', nullable: true })
    assigned_to: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignee: User;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
