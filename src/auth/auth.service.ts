import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async login(data: LoginDto) {
        const usr = await this.usersRepository.findOne({
            where: { email: data.email },
            relations: ['role'],
        });

        if (!usr || !(await bcrypt.compare(data.password, usr.password))) {
            console.log("login failed for:", data.email);
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokendata = { sub: usr.id, email: usr.email, role: usr.role.name };

        return {
            access_token: this.jwtService.sign(tokendata),
        };
    }
}
