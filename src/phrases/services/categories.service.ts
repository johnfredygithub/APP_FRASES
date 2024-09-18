import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateCategoriesDto } from '../dto/create-categories.dto';
import { UpdatePhraseDto } from '../dto/update-phrase.dto';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Phrase } from '../entities/phrase.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
    //llamar a frases
  ) {}

  async create(createCategoriesDto: CreateCategoriesDto) {
    try {
      const nombre = await this.categoriesRepository.findOneBy({
        nombre: createCategoriesDto.nombre,
      });

      const nombreEnMayusculas = createCategoriesDto.nombre.toUpperCase();
      if (nombre) {
        throw new BadRequestException({ msj: 'categoria ya existe' });
      }
      const category = this.categoriesRepository.create({
        nombre: nombreEnMayusculas,
      });

      return this.categoriesRepository.save(category);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.categoriesRepository.find();
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(searchValue: string) {
    try {
      const category = await this.categoriesRepository.find({
        where: { nombre: Like('%' + `${searchValue.toUpperCase()}` + '%') },
      });
      if (category.length <= 0) {
        throw new NotFoundException();
      } else {
        return category;
      }
    } catch (error) {
      throw error;
    }
  }

  ////cambiar or dto updteate
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException({ msj: 'categoria no existe' });
    }

    const nombreEnMayusculas = updateCategoryDto.nombre.toUpperCase();

    await this.categoriesRepository.update(id, {
      nombre: nombreEnMayusculas,
    });
    return await this.categoriesRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id: id },
      relations: ['phrases'],
    });
    if (!category) {
      throw new NotFoundException({ msj: 'categoria no existe' });
    }
    return this.categoriesRepository.remove(category);
  }

  /////find one frases por categoria
  async findPhrasesXCategory(categoryId: number) {
    try {
      const frases = this.phraseRepository.find({
        where: { category: { id: categoryId } },
      });

      if ((await frases).length <= 0) {
        throw new NotFoundException({ msj: 'no hay frases' });
      }
      return frases;
    } catch (error) {
      throw error;
    }
  }
}
