import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
  ) {}

  async search(q: string, type?: string, page = 1, limit = 20) {
    const searchTerm = `%${q}%`;
    const where = { title: ILike(searchTerm), status: 'PUBLISHED' } as any;

    const [movies, movieTotal] =
      type === 'SERIES'
        ? [[], 0]
        : await this.movieRepo.findAndCount({
            where,
            take: limit,
            skip: (page - 1) * limit,
          });

    const [series, seriesTotal] =
      type === 'MOVIE'
        ? [[], 0]
        : await this.seriesRepo.findAndCount({
            where,
            take: limit,
            skip: (page - 1) * limit,
          });

    return {
      success: true,
      data: { movies, series, total: movieTotal + seriesTotal },
    };
  }

  async suggestions(q: string) {
    const where = { title: ILike(`%${q}%`), status: 'PUBLISHED' } as any;
    const movies = await this.movieRepo.find({
      where,
      take: 5,
      select: ['title'],
    });
    return {
      success: true,
      data: movies.map((m) => m.title),
    };
  }
}
