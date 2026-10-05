import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeriesService } from './series.service';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private series: SeriesService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('genre') genre?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: string,
  ) {
    return this.series.findAll({ status, featured: featured === 'true', genre, language, take: limit ? Number(limit) : undefined });
  }

  @Get('featured')
  featured() {
    return this.series.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.series.findById(id);
  }
}
