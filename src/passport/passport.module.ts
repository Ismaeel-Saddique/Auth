import * as dotenv from 'dotenv'
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
dotenv.config();

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy : 'jwt',
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '48h' }
        }),
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [],
    providers: [JwtStrategy],
    exports: [TypeOrmModule, JwtModule]
})
export class PassportModules { }
