import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
