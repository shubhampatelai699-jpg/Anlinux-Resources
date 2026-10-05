import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: { movie: true, series: true },
    });
  }

  add(userId: string, contentId: string, contentType: 'movie' | 'series') {
    return this.prisma.watchlist.create({
      data: {
        userId,
        contentId,
        contentType,
        movieId: contentType === 'movie' ? contentId : null,
        seriesId: contentType === 'series' ? contentId : null,
      },
    });
  }

  remove(userId: string, contentId: string, contentType: 'movie' | 'series') {
    return this.prisma.watchlist.delete({
      where: { userId_contentId_contentType: { userId, contentId, contentType } },
    });
  }
}
