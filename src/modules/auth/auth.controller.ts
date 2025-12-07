import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn({
      account: signInDto.account,
      password: signInDto.password.toString(),
    });
  }

  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register({
      account: registerDto.account,
      password: registerDto.password.toString(),
    });
  }
}