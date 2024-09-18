import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Phrase } from '../phrases/entities/phrase.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
  ) {}

  ///////FAVORITES
  async addFavoritePhrase(token: string, phraseId: number) {
    const payload = this.jwtService.decode(token); // Verificar token
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['favoritePhrases'],
      });

      const phrase = await this.phraseRepository.findOne({
        where: { ID: phraseId },
      });

      if (user && phrase) {
        user.favoritePhrases.push(phrase);
        return await this.userRepository.save(user);
      } else {
        throw new BadRequestException('User or phrase not found');
      }
    } catch (error) {
      throw error;
    }
  }

  /////Método para eliminar una frase de un usuario
  async removePhraseByUser(token: string, phraseId: number) {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      //const userId = payload.sub;
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['favoritePhrases'],
      });

      user.favoritePhrases = user.favoritePhrases.filter(
        (item) => item.ID !== phraseId,
      );
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener todas las frases favoritas de un usuario
  async findAllFavoritePhrases(token: string): Promise<Phrase[]> {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['favoritePhrases'],
      });

      if (!user) {
        throw new BadRequestException(' not found');
      }

      return user.favoritePhrases;
    } catch (error) {
      throw error;
    }
  }

  ////////DISLIKES
  async addDislikePhrase(token: string, phraseId: number) {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['dislikePhrases'],
      });

      const phrase = await this.phraseRepository.findOne({
        where: { ID: phraseId },
      });

      if (user && phrase) {
        user.dislikePhrases.push(phrase);
        return await this.userRepository.save(user);
      } else {
        throw new BadRequestException('User or phrase not found');
      }
    } catch (error) {
      throw error;
    }
  }

  /////Método para eliminar una frase de un usuario
  async removeDislikePhraseByUser(token: string, phraseId: number) {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['dislikePhrases'],
      });

      user.dislikePhrases = user.dislikePhrases.filter(
        (item) => item.ID !== phraseId,
      );
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener todas las frases q no le gustan de un usuario
  async findAllDislikePhrases(token: string) {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['dislikePhrases'],
      });

      if (!user) {
        throw new BadRequestException(' not found');
      }

      return user.dislikePhrases;
    } catch (error) {
      throw error;
    }
  }

  ///////USER_____________
  //////find one email
  async findOneEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /////mentodo para registrar un usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;
      newUser.rol = 'user';
      return this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
