import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlist: WatchlistService) {}

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.watchlist.findByUser(req.user.userId);
  }

  @Post()
  add(
    @Request() req: { user: { userId: string } },
    @Body() body: { contentId: string; contentType: 'movie' | 'series' }
  ) {
    return this.watchlist.add(req.user.userId, body.contentId, body.contentType);
  }

  @Delete(':contentType/:contentId')
  remove(
    @Request() req: { user: { userId: string } },
    @Param('contentType') contentType: 'movie' | 'series',
    @Param('contentId') contentId: string
  ) {
    return this.watchlist.remove(req.user.userId, contentId, contentType);
  }
}
