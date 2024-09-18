import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhraseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly ID: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly FRASE: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly AUTOR: string;

  /////LLAVE FORANEA DE LA TABLA PHRASES
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly CATEGORIAID: number;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly create_at: string;
}
