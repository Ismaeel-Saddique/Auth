import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModules } from 'src/passport/passport.module';

@Module({
  imports: [
    PassportModules, 
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {

}
