import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { user } from 'src/entities/user';

@Module({
  imports: [
  TypeOrmModule.forFeature([user]),
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions:{expiresIn: '1h'}
  })
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {

}
