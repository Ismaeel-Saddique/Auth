import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
//import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(user)
        private readonly userRepository: Repository<user>,
        private readonly jwtService: JwtService
        ){}

        async signup(username: string, password: string): Promise<user> {
            const user = this.userRepository.create({ username, password });
            return this.userRepository.save(user);
          }
        
          async validateUser(username: string, password: string): Promise<any> {
            const user = await this.userRepository.findOne({ where: { username } });
            if (user && password == user.password) {
              return user;
            }
            return null;
          }
        
          async login(user: any) {
            const payload = { username: user.username, sub: user.id };
            return {
              access_token: this.jwtService.sign(payload),
            };
          }
        
          async findAll(): Promise<user[]> {
            return this.userRepository.find();
          }
        }

