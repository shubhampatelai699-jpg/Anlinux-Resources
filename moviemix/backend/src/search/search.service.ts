import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string, type?: 'movie' | 'series', limit = 20) {
    const movies = type !== 'series' ? await this.prisma.movie.findMany({
      where: { title: { contains: q, mode: 'insensitive' }, status: 'published' },
      take: limit,
    }) : [];
    const series = type !== 'movie' ? await this.prisma.series.findMany({
      where: { title: { contains: q, mode: 'insensitive' }, status: 'published' },
      take: limit,
    }) : [];
    return { movies, series };
  }
}
