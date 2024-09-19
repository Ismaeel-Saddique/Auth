import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body('username') username: string, @Body('password') password: string) {
    return this.authService.signup(username, password);
  }

  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Get('get-users')
  async getUsers() {
    return this.authService.findAll();
  }
}
