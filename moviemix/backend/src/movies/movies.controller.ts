import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private movies: MoviesService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('genre') genre?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: string,
  ) {
    return this.movies.findAll({ status, featured: featured === 'true', genre, language, take: limit ? Number(limit) : undefined });
  }

  @Get('featured')
  featured() {
    return this.movies.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movies.findById(id);
  }
}
