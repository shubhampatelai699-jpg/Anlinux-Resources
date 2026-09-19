import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  findAll(query: { status?: string; featured?: boolean; genre?: string; language?: string; take?: number }) {
    return this.prisma.series.findMany({
      where: {
        status: query.status ?? 'published',
        featured: query.featured,
        genres: query.genre ? { some: { genreId: query.genre } } : undefined,
        languageCode: query.language,
      },
      include: { genres: { include: { genre: true } } },
      take: query.take ?? 20,
    });
  }

  findById(id: string) {
    return this.prisma.series.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        seasons: { include: { episodes: true } },
        cast: { include: { castMember: true } },
      },
    });
  }

  findFeatured() {
    return this.prisma.series.findMany({ where: { status: 'published', featured: true }, take: 10 });
  }
}
