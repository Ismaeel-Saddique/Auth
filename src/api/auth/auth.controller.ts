import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body(new ValidationPipe()) authcredentials: AuthCredentialsDto ) {
    return this.authService.signup(authcredentials);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) authcredentials: AuthCredentialsDto) {
    return this.authService.login(authcredentials);
  }

  @Get('get-users')
  async getUsers() {
    return this.authService.findAll();
  }
}
