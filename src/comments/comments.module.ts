import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketComment } from '../entities/ticket-comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TicketComment]),
        TicketsModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule { }
