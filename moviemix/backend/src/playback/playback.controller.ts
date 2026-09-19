import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlaybackService } from './playback.service';

@ApiTags('Playback')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('playback')
export class PlaybackController {
  constructor(private playback: PlaybackService) {}

  @Post('signed-url')
  signUrl(@Request() req: { user: { userId: string } }, @Body() body: { contentId: string }) {
    return this.playback.signUrl(body.contentId, req.user.userId);
  }
}
