import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core'; // Contexto para obtener metadata

import { ROLES_KEY } from '../decorators/roles.decorator'; // Clave para obtener roles desde metadata
//import { PayloadToken } from '../models/token.models'; // Modelo para el payload del token
import { Role } from '../decorators/roles.decorator'; // Enumeración que define roles de usuario

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} ////inyectar reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    ////obtener roles
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }
    // Obtener la solicitud (request) desde el contexto
    const request = context.switchToHttp().getRequest();

    // Imprimir en consola el usuario actual extraído de la solicitud
    console.log('request.user:', request.user);

    // Obtener el usuario del payload del token (si está presente)
    const user = request.user as PayloadToken;

    // Imprimir en consola información sobre el usuario
    console.log('user:', user);

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const isAuth = roles.some((role) => role === user.role);

    // Si el usuario no tiene los roles requeridos, lanzar una excepción no autorizada
    if (!isAuth) {
      throw new UnauthorizedException(
        'No tienes permisos para acceder a esta ruta. Roles requeridos: ' +
          roles +
          '. Rol del usuario: ' +
          user.role,
      );
    }

    // Si el usuario tiene los roles requeridos, permitir el acceso
    return isAuth;
  }
}

export interface PayloadToken {
  role: string;
  sub: number;
}
