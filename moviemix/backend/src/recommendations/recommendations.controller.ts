import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('for-you')
  async forYou(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.recommendationsService.forYou(page, limit);
  }

  @Get('movies/:id/similar')
  async similarMovies(@Param('id') id: string) {
    return this.recommendationsService.similarToMovie(id);
  }
}
