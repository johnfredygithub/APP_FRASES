// Importamos el decorador SetMetadata de '@nestjs/common'
import { SetMetadata } from '@nestjs/common';

//import { Role } from '../models/roles.model';
// Definimos una constante para la clave de los roles en los metadatos
export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export const ROLES_KEY = 'role';

// Creamos un decorador llamado Roles que toma una lista de roles como argumentos
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
