import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesDto } from './create-categories.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoriesDto) {}
