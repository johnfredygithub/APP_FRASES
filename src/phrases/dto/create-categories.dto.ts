import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly id?: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly nombre: string;
}
