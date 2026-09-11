import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private search: SearchService) {}

  @Get()
  search(@Query('q') q: string, @Query('type') type?: 'movie' | 'series', @Query('limit') limit?: string) {
    return this.search.search(q, type, limit ? parseInt(limit, 10) : 20);
  }
}
