import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService, PrismaService],
})
export class WatchlistModule {}
