import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';
//import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(user)
        private readonly userRepository: Repository<user>,
        private readonly jwtService: JwtService
    ) { }

    async signup(authcredential: AuthCredentialsDto): Promise<void> {
        const { username, password } = authcredential;
        const user = this.userRepository.create({
            username,
            password,
        });
        await this.userRepository.save(user);
    }

    async login(authcredential: AuthCredentialsDto) {
        const { username, password } = authcredential;
        const user = await this.userRepository.findOne({where: {username}})
        return user;
    }

    async findAll(): Promise<user[]> {
        return this.userRepository.find();
    }
}

