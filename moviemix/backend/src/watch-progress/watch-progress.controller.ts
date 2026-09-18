import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WatchProgressService } from './watch-progress.service';
import { WatchProgressDto } from './dto/watch-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('watch-progress')
@UseGuards(JwtAuthGuard)
export class WatchProgressController {
  constructor(private readonly watchProgressService: WatchProgressService) {}

  @Get(':contentType/:contentId')
  async get(
    @CurrentUser('userId') userId: string,
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
  ) {
    return this.watchProgressService.get(userId, contentType, contentId);
  }

  @Put(':contentType/:contentId')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: string,
    @Body() dto: WatchProgressDto,
  ) {
    return this.watchProgressService.update(
      userId,
      contentType,
      contentId,
      dto,
    );
  }
}
