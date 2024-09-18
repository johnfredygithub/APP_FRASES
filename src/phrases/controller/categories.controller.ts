import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoriesDto } from '../dto/create-categories.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createcategoryDto: CreateCategoriesDto) {
    return this.categoriesService.create(createcategoryDto);
  }

  @Public()
  @Get()
  findOne(@Query('searchValue') searchValue: string) {
    return this.categoriesService.findOne(searchValue);
  }

  @Public()
  @Get('phrases')
  findPhrases(@Query('phrasesXcategory') phrasesXcategory: number) {
    return this.categoriesService.findPhrasesXCategory(+phrasesXcategory);
  }

  @Public()
  @Get('all')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
