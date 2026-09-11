import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

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

  createMovie(data: any) {
    return this.prisma.movie.create({ data });
  }

  updateMovie(id: string, data: any) {
    return this.prisma.movie.update({ where: { id }, data });
  }

  deleteMovie(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }

  createSeries(data: any) {
    return this.prisma.series.create({ data });
  }

  createSeason(seriesId: string, data: any) {
    return this.prisma.season.create({ data: { ...data, seriesId } });
  }

  createEpisode(seasonId: string, data: any) {
    return this.prisma.episode.create({ data: { ...data, seasonId } });
  }

  createGenre(name: string, slug: string) {
    return this.prisma.genre.create({ data: { name, slug } });
  }

  setUserRole(id: string, role: string) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }
}
