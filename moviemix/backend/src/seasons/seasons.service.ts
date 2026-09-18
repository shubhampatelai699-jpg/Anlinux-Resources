import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './entities/season.entity';

@Injectable()
export class SeasonsService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepo: Repository<Season>,
  ) {}

  async findOne(id: string) {
    const season = await this.seasonRepo.findOne({
      where: { id },
      relations: ['series'],
    });
    if (!season) throw new NotFoundException('Season not found');
    return { success: true, data: season };
  }

  async episodes(id: string) {
    const season = await this.seasonRepo.findOne({
      where: { id },
      relations: ['episodes'],
    });
    if (!season) throw new NotFoundException('Season not found');
    return { success: true, data: season.episodes };
  }
}
