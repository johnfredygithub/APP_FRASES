import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';

import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('recovery')
  recuperarPassword(@Param() email: string) {
    return this.authService.sendRecovery(email);
  }

  /////CAMBIAR PASWORD
  @Post('changePassword')
  changePassword(@Req() req: Request, @Query('token') token: string) {
    const newPassword = req.body.password;
    return this.authService.changePassword(token, newPassword);
  }

  //////register
  @Post('register')
  Register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  /////find
  @UseGuards(AuthGuard('jwt'))
  @Post('find')
  FindUser(@Req() req: Request) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.authService.findUserByToken(token);
  }
}
