import { DataSource } from 'typeorm';

import { readFileSync } from 'fs';
import { User } from './users/entities/user.entity'; // Ajusta la ruta según tu estructura de proyecto
import { Phrase } from './phrases/entities/phrase.entity';
import { Category } from './phrases/entities/category.entity';
import * as dotenv from 'dotenv'; // C

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  ssl:
    process.env.DATABASE_SSL === 'true'
      ? {
          ca: readFileSync('./src/database/ca.crt').toString(),
        }
      : false,
  entities: [User, Phrase, Category],
  migrations: ['./src/database/migrations/*.ts'],
  migrationsTableName: 'custom_migration_table',
  synchronize: true,
});
