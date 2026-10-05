import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HistoryService } from './history.service';

@ApiTags('History')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('history')
export class HistoryController {
  constructor(private history: HistoryService) {}

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.history.findByUser(req.user.userId);
  }

  @Post('heartbeat')
  heartbeat(
    @Request() req: { user: { userId: string } },
    @Body() body: { movieId?: string; episodeId?: string; progressSeconds: number; completed?: boolean }
  ) {
    return this.history.upsert(req.user.userId, body);
  }

  @Delete(':id')
  remove(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.history.remove(req.user.userId, id);
  }
}
