import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchHistoryController } from './watch-history.controller';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistory } from './entities/watch-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WatchHistory])],
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService],
  exports: [WatchHistoryService],
})
export class WatchHistoryModule {}
