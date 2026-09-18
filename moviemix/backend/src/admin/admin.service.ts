import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateSeriesDto, CreateSeasonDto, CreateEpisodeDto } from './dto/create-series.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async stats() {
    const [users, movies, series, activeSubs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.movie.count(),
      this.prisma.series.count(),
      this.prisma.subscription.count({ where: { status: 'active' } }),
    ]);
    return { users, movies, series, activeSubs, plays24h: 0, storageUsed: 0 };
  }

  listMovies() {
    return this.prisma.movie.findMany({
      include: { genres: { include: { genre: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  createMovie(data: CreateMovieDto) {
    const { genreIds, ...rest } = data;
    return this.prisma.movie.create({
      data: {
        ...rest,
        genres: genreIds ? { create: genreIds.map((id) => ({ genre: { connect: { id } } })) } : undefined,
      },
      include: { genres: { include: { genre: true } } },
    });
  }

  updateMovie(id: string, data: CreateMovieDto) {
    const { genreIds, ...rest } = data;
    return this.prisma.movie.update({
      where: { id },
      data: {
        ...rest,
        genres: genreIds ? {
          deleteMany: {},
          create: genreIds.map((gid) => ({ genre: { connect: { id: gid } } })),
        } : undefined,
      },
      include: { genres: { include: { genre: true } } },
    });
  }

  deleteMovie(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }

  listSeries() {
    return this.prisma.series.findMany({
      include: { genres: { include: { genre: true } }, seasons: { include: { episodes: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  createSeries(data: CreateSeriesDto) {
    const { genreIds, ...rest } = data;
    return this.prisma.series.create({
      data: {
        ...rest,
        genres: genreIds ? { create: genreIds.map((id) => ({ genre: { connect: { id } } })) } : undefined,
      },
      include: { genres: { include: { genre: true } } },
    });
  }

  createSeason(seriesId: string, data: CreateSeasonDto) {
    return this.prisma.season.create({ data: { ...data, seriesId }, include: { episodes: true } });
  }

  createEpisode(seasonId: string, data: CreateEpisodeDto) {
    return this.prisma.episode.create({ data: { ...data, seasonId } });
  }

  listGenres() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  createGenre(name: string, slug: string) {
    return this.prisma.genre.create({ data: { name, slug } });
  }

  listUsers() {
    return this.prisma.user.findMany({ select: { id: true, email: true, displayName: true, role: true, createdAt: true } });
  }

  setUserRole(id: string, role: string) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }
}
