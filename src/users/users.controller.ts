import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as request from 'supertest';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //////favorites_user
  @Post('/favorites/:phraseId')
  async addFavorite(@Param('phraseId') phraseId: number, @Req() req: Request) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.usersService.addFavoritePhrase(token, phraseId);
  }

  @Delete('/favorites/:phraseId')
  async removeFavorite(
    @Param('phraseId') phraseId: number,
    @Req() req: Request,
  ) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.usersService.removePhraseByUser(token, +phraseId);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  async getFavoritePhrases(@Req() req: Request) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token

    return this.usersService.findAllFavoritePhrases(token);
  }

  //////DISLIKES_USER
  @Post('/dislikes/:phraseId')
  async addDislike(@Req() req: Request, @Param('phraseId') phraseId: number) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.usersService.addDislikePhrase(token, phraseId);
  }

  @Delete('/dislikes/:phraseId')
  async removeDislike(
    @Req() req: Request,
    @Param('phraseId') phraseId: number,
  ) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.usersService.removeDislikePhraseByUser(token, +phraseId);
  }
  @Get('dislikes/')
  async getDislikePhrases(@Req() req: Request) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Extrae el token
    return this.usersService.findAllDislikePhrases(token);
  }

  /////TODO:ELIMINAR Y VERIFICAR ALGUNAS RUTAS NO USADAS
  /* @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  } */

  /* @Get()
  findAll() {
    return this.usersService.findAll();
  } */

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  } */

  ////TODO:RUTAS NO USADAS
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
