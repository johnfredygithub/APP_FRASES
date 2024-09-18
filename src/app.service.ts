import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import config from './config';
import { ConfigType } from '@nestjs/config';

@Injectable() 
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async getHello(): Promise<any> {
    //const result =  await  this.dataSource.query('SELECT * FROM public."FRASES"');
    return `Hello World!, ${this.configService.apiKey}|||
    ${this.configService.LINK_FRONTEND}|||     ${this.configService.postgres.DATABASE_URL}`;
  }
}
