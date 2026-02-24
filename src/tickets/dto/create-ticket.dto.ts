import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateTicketDto {
        @IsString()
    @MinLength(5)
    title: string;

        @IsString()
    @MinLength(10)
    description: string;

        @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    @IsOptional()
    priority?: string = 'MEDIUM';
}
