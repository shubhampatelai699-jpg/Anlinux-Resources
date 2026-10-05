import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('q') q: string, @Query('type') type?: 'movie' | 'series', @Query('limit') limit?: string) {
    return this.searchService.search(q, type, limit ? parseInt(limit, 10) : 20);
  }
}
