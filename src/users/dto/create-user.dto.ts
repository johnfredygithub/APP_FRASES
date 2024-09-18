import { ApiProperty } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly id: number;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly recovery_token: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly rol: string;

  @IsOptional()
  readonly create_at: string;

  ///////columnas estra en caso de necesitar mas campos
  @IsString()
  @ApiProperty()
  @IsOptional()
  readonly extra_data1: string;

  @IsString()
  @IsOptional()
  readonly extra_data2: string;

  @IsString()
  @IsOptional()
  readonly extra_data3: string;

  /////columna SOLO disponble en postgres>=9.2(MSSQL SOPORTA DESDE LA VERSION 2016- MYSQL>versión 5.7  )
  @IsJSON()
  @IsOptional()
  readonly doc_jsondata: string;
}
