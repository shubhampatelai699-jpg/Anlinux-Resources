import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { Genre } from '../genres/entities/genre.entity';
import { WatchProgress } from '../watch-progress/entities/watch-progress.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
    @InjectRepository(WatchProgress)
    private readonly progressRepo: Repository<WatchProgress>,
  ) {}

  async getHome(userId: string) {
    const [hero, continueWatching, trending, newReleases, popular, genres] =
      await Promise.all([
        this.hero(),
        this.continueWatching(userId),
        this.trending(),
        this.newReleases(),
        this.popular(),
        this.genres(),
      ]);

    return {
      success: true,
      data: {
        hero: hero.data,
        continueWatching: continueWatching.data,
        trending: trending.data,
        newReleases: newReleases.data,
        popular: popular.data,
        genres: genres.data,
      },
    };
  }

  async hero() {
    const items = await this.movieRepo.find({
      where: { featured: true, status: 'PUBLISHED' },
      take: 5,
    });
    return { success: true, data: items };
  }

  async trending() {
    const items = await this.movieRepo.find({
      where: { status: 'PUBLISHED' },
      order: { rating: 'DESC' },
      take: 10,
    });
    return { success: true, data: items };
  }

  async popular() {
    const items = await this.movieRepo.find({
      where: { status: 'PUBLISHED' },
      order: { rating: 'DESC' },
      take: 10,
    });
    return { success: true, data: items };
  }

  async newReleases() {
    const items = await this.movieRepo.find({
      where: { status: 'PUBLISHED' },
      order: { publishedAt: 'DESC' },
      take: 10,
    });
    return { success: true, data: items };
  }

  async genres() {
    const items = await this.genreRepo.find({ order: { name: 'ASC' } });
    return { success: true, data: items };
  }

  async continueWatching(userId: string) {
    const items = await this.progressRepo.find({
      where: { userId, completed: false },
      order: { lastWatchedAt: 'DESC' },
      take: 10,
    });
    return { success: true, data: items };
  }
}
