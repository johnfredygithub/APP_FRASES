import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; ////ENTIDAD

import { TypeOrmModule } from '@nestjs/typeorm'; ///ORM
import { Phrase } from 'src/phrases/entities/phrase.entity';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Phrase]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ], ////IMPORTAR ENTIDADES
  controllers: [UsersController], ///CONTROLLERS
  providers: [UsersService],
  exports: [UsersService], ////EXPORTAR SERVICIOS DE SER NECESARIO
})
export class UsersModule {}
