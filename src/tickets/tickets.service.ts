import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketStatusLog } from '../entities/ticket-status-log.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket) private ticketsRepository: Repository<Ticket>,
        @InjectRepository(TicketStatusLog) private logsRepository: Repository<TicketStatusLog>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
    ) { }

    async create(createTicketDto: CreateTicketDto, userObj: any) {
        const ticket = this.ticketsRepository.create({
            ...createTicketDto,
            created_by: userObj.userId,
        });
        return this.ticketsRepository.save(ticket);
    }

    async findAll(userObj: any) {
        const query = this.ticketsRepository.createQueryBuilder('ticket');

        if (userObj.role === 'USER') {
            query.where('ticket.created_by = :userId', { userId: userObj.userId });
        } else if (userObj.role === 'SUPPORT') {
            query.where('ticket.assigned_to = :userId', { userId: userObj.userId });
        }
        // MANAGER gets all

        return query.getMany();
    }

    async findOne(id: number) {
        const ticket = await this.ticketsRepository.findOne({ where: { id } });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async assign(id: number, assignDto: AssignTicketDto, userObj: any) {
        const ticket = await this.findOne(id);
        const assignee = await this.usersRepository.findOne({
            where: { id: assignDto.assigneeId },
            relations: ['role'],
        });

        if (!assignee) throw new NotFoundException('Assignee not found');
        if (assignee.role.name === 'USER') {
            throw new BadRequestException('Cannot assign ticket to USER role');
        }

        ticket.assigned_to = assignee.id;
        return this.ticketsRepository.save(ticket);
    }

    async updateStatus(id: number, updateDto: UpdateStatusDto, userObj: any) {
        const ticket = await this.findOne(id);

        const stages = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        const oldIdx = stages.indexOf(ticket.status);
        const newIdx = stages.indexOf(updateDto.status);

        if (newIdx !== oldIdx + 1) {
            throw new BadRequestException('Invalid status transition');
        }

        const oldStatus = ticket.status;
        ticket.status = updateDto.status;

        await this.ticketsRepository.save(ticket);

        const log = this.logsRepository.create({
            ticket_id: ticket.id,
            old_status: oldStatus,
            new_status: updateDto.status,
            changed_by: userObj.userId,
        });
        await this.logsRepository.save(log);

        return ticket;
    }

    async remove(id: number) {
        const ticket = await this.findOne(id);
        await this.ticketsRepository.remove(ticket);
    }
}
