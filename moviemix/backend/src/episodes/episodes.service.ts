import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
  ) {}

  async findOne(id: string) {
    const episode = await this.episodeRepo.findOne({
      where: { id },
      relations: ['season', 'mediaAssets'],
    });
    if (!episode) throw new NotFoundException('Episode not found');
    return { success: true, data: episode };
  }
}
