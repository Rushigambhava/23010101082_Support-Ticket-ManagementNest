import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity({ name: 'ticket_status_logs' })
export class TicketStatusLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ticket_id' })
    ticket_id: number;

    @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @Column({ type: 'enum', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] })
    old_status: string;

    @Column({ type: 'enum', enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] })
    new_status: string;

    @Column({ name: 'changed_by' })
    changed_by: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'changed_by' })
    user: User;

    @CreateDateColumn({ name: 'changed_at' })
    changed_at: Date;
}
