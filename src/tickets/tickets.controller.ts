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
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles('USER', 'MANAGER')
        create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
        return this.ticketsService.create(createTicketDto, req.user);
    }

    @Get()
        findAll(@Request() req) {
        return this.ticketsService.findAll(req.user);
    }

    @Patch(':id/assign')
    @Roles('MANAGER', 'SUPPORT')
    assign(
        @Param('id') id: string,
        @Body() assignDto: AssignTicketDto,
        @Request() req,
    ) {
        return this.ticketsService.assign(+id, assignDto, req.user);
    }

    @Patch(':id/status')
    @Roles('MANAGER', 'SUPPORT')
    updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateStatusDto,
        @Request() req,
    ) {
        return this.ticketsService.updateStatus(+id, updateDto, req.user);
    }

    @Delete(':id')
    @Roles('MANAGER')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(+id);
    }
}
