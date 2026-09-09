import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async dashboard() {
    const [movies, series, episodes, users] = await Promise.all([
      this.movieRepo.count(),
      this.movieRepo.count(),
      this.episodeRepo.count(),
      this.userRepo.count(),
    ]);
    return {
      success: true,
      data: { movies, series, episodes, users },
    };
  }

  async analytics() {
    return {
      success: true,
      data: {
        dailyActiveUsers: 0,
        watchHours: 0,
        newRegistrations: 0,
        topContent: [],
      },
    };
  }

  async publishMovie(id: string) {
    const movie = await this.movieRepo.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');
    movie.status = 'PUBLISHED';
    movie.publishedAt = new Date();
    await this.movieRepo.save(movie);
    return { success: true, data: movie };
  }

  async unpublishMovie(id: string) {
    const movie = await this.movieRepo.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');
    movie.status = 'UNPUBLISHED';
    await this.movieRepo.save(movie);
    return { success: true, data: movie };
  }

  async publishEpisode(id: string) {
    const episode = await this.episodeRepo.findOne({ where: { id } });
    if (!episode) throw new NotFoundException('Episode not found');
    episode.status = 'PUBLISHED';
    episode.publishedAt = new Date();
    await this.episodeRepo.save(episode);
    return { success: true, data: episode };
  }
}
