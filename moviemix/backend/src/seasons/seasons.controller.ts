import { Controller, Get, Param } from '@nestjs/common';
import { SeasonsService } from './seasons.service';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seasonsService.findOne(id);
  }

  @Get(':id/episodes')
  async episodes(@Param('id') id: string) {
    return this.seasonsService.episodes(id);
  }
}
