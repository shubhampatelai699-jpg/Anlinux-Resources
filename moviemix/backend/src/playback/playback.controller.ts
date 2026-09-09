import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { PlaybackSessionDto } from './dto/playback-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('playback')
@UseGuards(JwtAuthGuard)
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Post('session')
  async createSession(
    @CurrentUser('userId') userId: string,
    @Body() dto: PlaybackSessionDto,
  ) {
    return this.playbackService.createSession(userId, dto);
  }
}
