import { Controller, Get, Param } from '@nestjs/common';
import { EpisodesService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.episodesService.findOne(id);
  }
}
