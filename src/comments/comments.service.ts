import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketComment } from '../entities/ticket-comment.entity';
import { TicketsService } from '../tickets/tickets.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(TicketComment) private commentsRepository: Repository<TicketComment>,
        private ticketsService: TicketsService,
    ) { }

    async checkTicketAccess(ticketId: number, userObj: any) {
        const ticket = await this.ticketsService.findOne(ticketId);
        if (userObj.role === 'MANAGER') return ticket;
        if (userObj.role === 'SUPPORT' && ticket.assigned_to === userObj.userId) return ticket;
        if (userObj.role === 'USER' && ticket.created_by === userObj.userId) return ticket;
        throw new ForbiddenException('You do not have access to this ticket');
    }

    async create(ticketId: number, createDto: CreateCommentDto, userObj: any) {
        await this.checkTicketAccess(ticketId, userObj);
        const comment = this.commentsRepository.create({
            ticket_id: ticketId,
            user_id: userObj.userId,
            comment: createDto.comment,
        });
        return this.commentsRepository.save(comment);
    }

    async findAllByTicket(ticketId: number, userObj: any) {
        await this.checkTicketAccess(ticketId, userObj);
        return this.commentsRepository.find({ where: { ticket_id: ticketId }, relations: ['user'] });
    }

    async findOne(id: number) {
        const comment = await this.commentsRepository.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('Comment not found');
        return comment;
    }

    async update(id: number, updateDto: UpdateCommentDto, userObj: any) {
        const comment = await this.findOne(id);
        if (userObj.role !== 'MANAGER' && comment.user_id !== userObj.userId) {
            throw new ForbiddenException('You can only edit your own comments ');
        }
        comment.comment = updateDto.comment;
        return this.commentsRepository.save(comment);
    }

    async remove(id: number, userObj: any) {
        const comment = await this.findOne(id);
        if (userObj.role !== 'MANAGER' && comment.user_id !== userObj.userId) {
            throw new ForbiddenException('You can only delete your own comments ');
        }
        await this.commentsRepository.remove(comment);
    }
}
