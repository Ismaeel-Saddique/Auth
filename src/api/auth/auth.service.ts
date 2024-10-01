import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCredenitialsDto } from 'src/dto/updatecredentials.dto';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) { }

    async signup(authcredential: AuthCredentialsDto) {
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
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(user.id, { refreshToken: hashedToken });
        return { accessToken, refreshToken };
    }

    async refreshtoken(id: string, refreshToken: string) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Not Compared');
        }
        const payload = { username: user.username };
        const newAccessToken = await this.jwtService.signAsync(payload);
        const newRefreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
        const newHashedtoken = await bcrypt.hash(newRefreshToken, 10);
        await this.userRepository.update(user.id, { refreshToken: newHashedtoken })
        return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async updateUser(id: string, updateDto: UpdateCredenitialsDto) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new Error("User not found");

        if (updateDto.username) {
            user.username = updateDto.username;
        }

        if (updateDto.password) {
            user.password = await bcrypt.hash(updateDto.password, 10);
        }
        await this.userRepository.save(user);
    }

    deleteuser(id: string) {
        return this.userRepository.delete({ id })
    }


}

