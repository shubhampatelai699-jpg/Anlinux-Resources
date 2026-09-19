import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.watchHistory.findMany({
      where: { userId },
      include: { movie: true, episode: { include: { season: { include: { series: true } } } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async upsert(userId: string, data: { movieId?: string; episodeId?: string; progressSeconds: number; completed?: boolean }) {
    const existing = await this.prisma.watchHistory.findFirst({
      where: { userId, movieId: data.movieId ?? null, episodeId: data.episodeId ?? null },
    });
    if (existing) {
      return this.prisma.watchHistory.update({
        where: { id: existing.id },
        data: { progressSeconds: data.progressSeconds, completed: data.completed ?? false },
      });
    }
    return this.prisma.watchHistory.create({
      data: { userId, ...data, completed: data.completed ?? false },
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.watchHistory.deleteMany({ where: { id, userId } });
  }
}
