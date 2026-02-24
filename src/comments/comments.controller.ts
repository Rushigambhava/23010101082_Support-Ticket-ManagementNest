import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('tickets/:ticketId/comments')
        create(
        @Param('ticketId') ticketId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentsService.create(+ticketId, createCommentDto, req.user);
    }

    @Get('tickets/:ticketId/comments')
        findAllByTicket(@Param('ticketId') ticketId: string, @Request() req) {
        return this.commentsService.findAllByTicket(+ticketId, req.user);
    }

    @Patch('comments/:id')
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Request() req,
    ) {
        return this.commentsService.update(+id, updateCommentDto, req.user);
    }

    @Delete('comments/:id')
    remove(@Param('id') id: string, @Request() req) {
        return this.commentsService.remove(+id, req.user);
    }
}
