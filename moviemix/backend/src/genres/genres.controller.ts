import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private genres: GenresService) {}

  @Get()
  findAll() {
    return this.genres.findAll();
  }
}
