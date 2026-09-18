import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistItemDto } from './dto/watchlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  async findAll(@CurrentUser('userId') userId: string) {
    return this.watchlistService.findAll(userId);
  }

  @Post()
  async add(
    @CurrentUser('userId') userId: string,
    @Body() dto: WatchlistItemDto,
  ) {
    return this.watchlistService.add(userId, dto);
  }

  @Delete(':contentType/:contentId')
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
  ) {
    return this.watchlistService.remove(userId, contentType, contentId);
  }
}
