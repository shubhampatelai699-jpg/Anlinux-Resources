import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('watch-history')
@UseGuards(JwtAuthGuard)
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.watchHistoryService.findAll(userId, page, limit);
  }

  @Delete(':contentType/:contentId')
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
  ) {
    return this.watchHistoryService.remove(userId, contentType, contentId);
  }
}
