import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  findAll(query: { status?: string; featured?: boolean; genre?: string; skip?: number; take?: number }) {
    return this.prisma.movie.findMany({
      where: {
        status: query.status,
        featured: query.featured,
        genres: query.genre ? { some: { genreId: query.genre } } : undefined,
      },
      include: { genres: { include: { genre: true } } },
      skip: query.skip,
      take: query.take ?? 20,
    });
  }

  findById(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: { genres: { include: { genre: true } }, cast: { include: { castMember: true } } },
    });
  }

  findFeatured() {
    return this.prisma.movie.findMany({ where: { status: 'published', featured: true }, take: 10 });
  }
}
