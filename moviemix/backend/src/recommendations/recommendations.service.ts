import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async forYou(page = 1, limit = 20) {
    const [items, total] = await this.movieRepo.findAndCount({
      where: { status: 'PUBLISHED' },
      order: { rating: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { success: true, data: { items, total, page, limit } };
  }

  async similarToMovie(id: string) {
    const [items] = await this.movieRepo.findAndCount({
      where: { status: 'PUBLISHED' },
      take: 10,
    });
    return { success: true, data: items.filter((m) => m.id !== id) };
  }
}
