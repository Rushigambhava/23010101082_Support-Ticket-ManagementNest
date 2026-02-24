import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity({ name: 'ticket_comments' })
export class TicketComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ticket_id' })
    ticket_id: number;

    @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @Column({ name: 'user_id' })
    user_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('text')
    comment: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
