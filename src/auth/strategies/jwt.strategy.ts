import { Inject, Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import config from 'src/config';
import { ConfigType } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extraer token de la cabecera
      ignoreExpiration: false, //ignorar expiracion
      secretOrKey: configService.jwtSecret, //llave secreta
    });
  }

  /////validar el payload usuario
  async validate(payload: any) {
    return { id: payload.id, username: payload.username };
  }
}
