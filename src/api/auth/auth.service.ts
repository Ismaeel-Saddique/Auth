import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCredenitialsDto } from 'src/dto/updatecredentials.dto';
import { error } from 'console';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async signup(authcredential: AuthCredentialsDto): Promise<void> {
        const { username, password } = authcredential;
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            password: hashedpassword,
        });
        await this.userRepository.save(user);
    }


    async login(authcredential: AuthCredentialsDto) {
        const { username, password } = authcredential;
        const user = await this.userRepository.findOne({ where: { username } })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };

    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async updateUser(id: number, updateDto: UpdateCredenitialsDto) {
        const user= await this.userRepository.findOne({ where: { id } })
        if(!user) throw new Error("User not found");

        if (updateDto.username) {
            user.username = updateDto.username;
        }

        if (updateDto.password) {            
            user.password = await bcrypt.hash(updateDto.password, 10);
        }      
        await this.userRepository.save(user);
    }

    deleteuser(id: number) {
        return this.userRepository.delete({ id })
    }


}

