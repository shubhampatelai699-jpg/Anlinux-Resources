import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchlistItem } from './entities/watchlist.entity';
import { WatchlistItemDto } from './dto/watchlist-item.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(WatchlistItem)
    private readonly watchlistRepo: Repository<WatchlistItem>,
  ) {}

  async findAll(userId: string) {
    const items = await this.watchlistRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: items };
  }

  async add(userId: string, dto: WatchlistItemDto) {
    const item = this.watchlistRepo.create({
      userId,
      contentType: dto.contentType,
      contentId: dto.contentId,
    });
    await this.watchlistRepo.save(item);
    return { success: true };
  }

  async remove(userId: string, contentType: string, contentId: string) {
    await this.watchlistRepo.delete({ userId, contentType, contentId });
    return { success: true };
  }
}
