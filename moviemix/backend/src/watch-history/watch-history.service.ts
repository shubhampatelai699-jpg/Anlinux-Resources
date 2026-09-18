import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchHistory } from './entities/watch-history.entity';

@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectRepository(WatchHistory)
    private readonly historyRepo: Repository<WatchHistory>,
  ) {}

  async findAll(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.historyRepo.findAndCount({
      where: { userId },
      order: { watchedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { success: true, data: { items, total, page, limit } };
  }

  async remove(userId: string, contentType: string, contentId: string) {
    await this.historyRepo.delete({ userId, contentType, contentId });
    return { success: true };
  }
}
