import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PhrasesService } from '../services/phrases.service';
import { CreatePhraseDto } from '../dto/create-phrase.dto';
import { UpdatePhraseDto } from '../dto/update-phrase.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('phrases')
@Controller('phrases')
export class PhrasesController {
  constructor(private readonly phrasesService: PhrasesService) {}

  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto) {
    return this.phrasesService.create(createPhraseDto);
  }

  @Public()
  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset?: number) {
    return this.phrasesService.findAll(limit, offset);
  }

  @Public()
  @Get('/name')
  findOne(@Query('searchValue') searchValue: string) {
    return this.phrasesService.findXFrase(searchValue);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePhraseDto: UpdatePhraseDto) {
    return this.phrasesService.update(+id, updatePhraseDto);
  }

  ///@Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phrasesService.remove(+id);
  }
  ///////ANADIR A FAVORITOS
}
