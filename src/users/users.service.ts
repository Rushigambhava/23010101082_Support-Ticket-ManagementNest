import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
    ) { }

    async create(payload: CreateUserDto) {
        const userExists = await this.usersRepository.findOne({ where: { email: payload.email } });
        if (userExists) {
            console.log('User already exist with this email:', payload.email);
            throw new BadRequestException('Email already in use');
        }

        const role = await this.rolesRepository.findOne({ where: { name: payload.role } });
        if (!role) {
            throw new BadRequestException('Invalid role');
        }

        const hashPass = await bcrypt.hash(payload.password, 10);

        const user = this.usersRepository.create({
            name: payload.name,
            email: payload.email,
            password: hashPass,
            role: role,
        });

        await this.usersRepository.save(user);

        const { password, ...result } = user;
        return result;
    }

    async findAll() {
        return this.usersRepository.find({ relations: ['role'], select: ['id', 'name', 'email', 'created_at'] });
    }
}
