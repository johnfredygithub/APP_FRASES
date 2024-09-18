import { Repository, Like } from 'typeorm';
import { CreatePhraseDto } from '../dto/create-phrase.dto';
import { UpdatePhraseDto } from '../dto/update-phrase.dto';
import { Phrase } from '../entities/phrase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class PhrasesService {
  constructor(
    @InjectRepository(Phrase)
    private readonly phrasesRepository: Repository<Phrase>,
    private configService: ConfigService,
  ) {}

  async create(createPhraseDto: CreatePhraseDto) {
    const existingPhrase = await this.phrasesRepository.findOneBy({
      FRASE: createPhraseDto.FRASE,
    });

    if (existingPhrase) {
      throw new BadRequestException({ msj: 'La frase ya existe' });
    }

    // Crear y guardar la frase
    const newPhrase = this.phrasesRepository.create(createPhraseDto);
    return this.phrasesRepository.save(newPhrase);
  }

  async findAll(limit: number, offset: number) {
    try {
      const frases = await this.phrasesRepository.find({
        take: limit,
        skip: offset,
      });
      if (!frases) {
        throw new BadRequestException({ msj: 'no hay frases' });
      }
      // Contar el número total de frases en la base de datos
      const totalFrases = await this.phrasesRepository.count();
      // Convertir limit y offset a números enteros antes de sumarlos
      const parsedLimit = parseInt(limit as any, 10);
      const parsedOffset = parseInt(offset as any, 10);

      // Calcular si hay una página siguiente
      const nextOffset = parsedOffset + parsedLimit;
      ////VARIABLE DE ENTORNO
      const urlBackend = this.configService.get<string>('LINK_BACKEND');
      const nextPage =
        parsedOffset + parsedLimit < totalFrases
          ? `${urlBackend}/api/v1/phrases?limit=${parsedLimit}&offset=${nextOffset}`
          : null;

      return {
        data: frases,
        nextPage: nextPage,
      };
    } catch (error) {
      return error;
    }
  }

  async findXFrase(searchValue: string) {
    searchValue = searchValue.toLowerCase();
    try {
      const frases = this.phrasesRepository.find({
        where: { FRASE: Like('%' + `${searchValue}` + '%') },
      });

      if ((await frases).length <= 0) {
        throw new NotFoundException({ msj: 'no hay frases' });
      }
      return frases;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updatePhraseDto: UpdatePhraseDto) {
    try {
      const frase = await this.phrasesRepository.find({ where: { ID: id } });
      if ((await frase.length) <= 0) {
        throw new NotFoundException({ msj: 'frase no existe' });
      }
      return this.phrasesRepository.update(id, updatePhraseDto);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const frase = await this.phrasesRepository.find({ where: { ID: id } });

      if ((await frase.length) <= 0) {
        throw new NotFoundException({ msj: 'frase no existe' });
      }
      return this.phrasesRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
