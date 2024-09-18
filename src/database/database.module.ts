import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { readFileSync } from 'fs';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('config.postgres.DATABASE_URL'),
        ssl:
          configService.get<boolean>('DATABASE_SSL') === true // Usa una variable de entorno para controlar SSL
            ? {
                ca: readFileSync('./src/database/ca.crt').toString(),
              }
            : false, // Desactiva SSL si no es necesario
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],

  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule {}
