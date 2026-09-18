import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await this.seriesRepo.findAndCount({
      where: { status: 'PUBLISHED' },
      relations: ['genres'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { success: true, data: { items, total, page, limit } };
  }

  async findOne(id: string) {
    const series = await this.seriesRepo.findOne({
      where: { id },
      relations: ['genres', 'seasons', 'mediaAssets'],
    });
    if (!series) throw new NotFoundException('Series not found');
    return { success: true, data: series };
  }

  async seasons(id: string) {
    const series = await this.seriesRepo.findOne({
      where: { id },
      relations: ['seasons'],
    });
    if (!series) throw new NotFoundException('Series not found');
    return { success: true, data: series.seasons };
  }
}
