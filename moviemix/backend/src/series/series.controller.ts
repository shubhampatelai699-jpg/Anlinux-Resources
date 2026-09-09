import { Controller, Get, Param, Query } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.seriesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @Get(':id/seasons')
  async seasons(@Param('id') id: string) {
    return this.seriesService.seasons(id);
  }
}
