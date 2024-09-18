import { Module } from '@nestjs/common';
import { PhrasesService } from './services/phrases.service';
import { PhrasesController } from './controller/phrases.controller';

import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';
import { Category } from './entities/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Phrase, Category])],
  controllers: [PhrasesController, CategoriesController],
  providers: [PhrasesService, CategoriesService],
  exports: [PhrasesService, CategoriesService],
})
export class PhrasesModule {}
