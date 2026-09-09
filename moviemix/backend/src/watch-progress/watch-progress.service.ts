import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchProgress } from './entities/watch-progress.entity';
import { WatchProgressDto } from './dto/watch-progress.dto';

@Injectable()
export class WatchProgressService {
  constructor(
    @InjectRepository(WatchProgress)
    private readonly progressRepo: Repository<WatchProgress>,
  ) {}

  async get(userId: string, contentType: string, contentId: string) {
    const progress = await this.progressRepo.findOne({
      where: { userId, contentType, contentId },
    });
    return { success: true, data: progress };
  }

  async update(
    userId: string,
    contentType: string,
    contentId: string,
    dto: WatchProgressDto,
  ) {
    const percentage = Math.min(
      100,
      Math.round((dto.positionSeconds / dto.durationSeconds) * 100 * 100) / 100,
    );
    const completed = percentage >= 95;

    const existing = await this.progressRepo.findOne({
      where: { userId, contentType, contentId },
    });

    const progress = existing
      ? this.progressRepo.merge(existing, {
          positionSeconds: dto.positionSeconds,
          durationSeconds: dto.durationSeconds,
          percentage,
          completed,
          lastWatchedAt: new Date(),
        })
      : this.progressRepo.create({
          userId,
          contentType,
          contentId,
          positionSeconds: dto.positionSeconds,
          durationSeconds: dto.durationSeconds,
          percentage,
          completed,
          lastWatchedAt: new Date(),
        });

    await this.progressRepo.save(progress);
    return { success: true, data: progress };
  }
}
