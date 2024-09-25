import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Delete, ParseIntPipe, Param, Put, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/dto/credentials.dto';
import { JwtGuard } from 'src/gaurds/authguard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCredenitialsDto } from 'src/dto/updatecredentials.dto';

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

  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-users')
  async getUsers() {
    return this.authService.findAll();
  }

  @Put(":id")
  //@UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  async edituser(@Param('id', ParseIntPipe)id : number, @Body(new ValidationPipe()) updatedto: UpdateCredenitialsDto){
    await this.authService.updateUser(id, updatedto)
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  async removeuser(@Param('id', ParseIntPipe)id : number){
    await this.authService.deleteuser(id)
  }


}
