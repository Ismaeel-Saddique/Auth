import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Delete, ParseIntPipe, Param, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';
import { JwtGuard } from 'src/gaurds/authguard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCredenitialsDto } from 'src/dto/updatecredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body(new ValidationPipe()) authcredentials: AuthCredentialsDto) {
    return this.authService.signup(authcredentials);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) authcredentials: AuthCredentialsDto) {
    return this.authService.login(authcredentials);
  }

  @Post('refresh/:id')
  async refreshtokens(
    @Param('id') id: string,
    @Body('refreshtoken', new ValidationPipe()) refreshtoken: string) {
    try {
      return await this.authService.refreshtoken(id, refreshtoken);
    }
    catch (error) {
      throw new UnauthorizedException('Inavalid Refresh Token');
    }
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-users')
  async getUsers() {
    return this.authService.findAll();
  }

  @Put("update/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  async edituser(@Param('id', ParseIntPipe) id: string, @Body(new ValidationPipe()) updatedto: UpdateCredenitialsDto) {
    await this.authService.updateUser(id, updatedto)
  }

  @Delete("delete/:id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  async removeuser(@Param('id', ParseIntPipe) id: string) {
    await this.authService.deleteuser(id)
  }


}
