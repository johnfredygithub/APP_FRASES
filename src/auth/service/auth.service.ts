import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import config from '../../config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../guards/roles.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private transporter;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    const { emailUser, emailPassword } = configService;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  ////valida usuario y password
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneEmail(email); ////email existes
    console.log(user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password); ////password correcto
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  ///generar token
  async generateJWT(user: User) {
    try {
      ////send token-recoverypassword
      const payload: PayloadToken = {
        role: user.rol,
        sub: user.id,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  ///////////recovery password send token-password
  async sendRecovery(email: string) {
    try {
      const user = await this.usersService.findOneEmail(email); ///email existe

      if (!user) {
        console.log('no encontro email');
        ////si no existe el email manda error
        throw new UnauthorizedException('email no existe');
      }
      const payload = { sub: user.id, email: user.email, role: user.rol };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.jwtSecret,
        expiresIn: '15min',
      });
      const link = `${this.configService.LINK_FRONTEN_RECOVERY}${token}`;
      await this.usersService.update(user.id, {
        recovery_token: token,
      }); //////ACTUALIZAR TOKEN

      const mail = {
        //from: 'cobragerc@gmail.com',
        to: user.email, // list of receivers
        subject: `RECUPERAR PASSWORD Hello johnn ✔ ${user.email}`, // Subject line
        html: `<b>INGRESA A ESTE LINK =>${link}</b>`, // html body
      };

      const rta = await this.sendEmail(mail.to, mail.subject, mail.html);
      console.log('rta', rta);
      return rta;
    } catch (error) {
      console.log('error', error);
    }
  }

  ///////FUNCION PARA ENVIAR EMAILS
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const mailOptions = {
        from: 'cobragerc@gmail.com',
        to: to,
        subject: subject,
        html: html,
      };
      const response = await this.transporter.sendMail(mailOptions);
      return response;
    } catch (error) {
      console.error('error', error);
    }
  }

  ///////find user by token
  async findUserByToken(token: string) {
    try {
      const payload = this.jwtService.decode(token); // Verificar token
      const user = await this.usersService.findOne(payload.sub); // Buscar usuario
      return user;
    } catch (error) {
      console.error('Error al procesar el token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  ///////CHANGE PASSWORD
  async changePassword(token: string, newPassword: string) {
    const secret = this.configService.jwtSecret;
    const payload = this.jwtService.verify(token, { secret }); ///verificar token

    const user = await this.usersService.findOne(payload.sub); //buscar usuario

    if (user.recovery_token !== token) {
      /////si el token no es igual al de la base de datos
      throw new UnauthorizedException(
        `invalid token,${token}===${user.recovery_token}`,
      );
    }
    /////hash the password
    const hash = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
      recovery_token: null,
      password: hash,
    }); //////token null and ACTUALIZAR PASSWORD
    return { message: 'password changed' };
  }

  ///////REGISTER
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const registrar = await this.usersService.create(createUserDto);
    if (registrar) {
      return this.generateJWT(registrar);
    }
    return registrar;
  }




}
