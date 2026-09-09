import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await this.movieRepo.findAndCount({
      where: { status: 'PUBLISHED' },
      relations: ['genres', 'mediaAssets'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { success: true, data: { items, total, page, limit } };
  }

  async findOne(id: string) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['genres', 'mediaAssets'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return { success: true, data: movie };
  }

  async recommendations(id: string) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['genres'],
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const items = await this.movieRepo.find({
      where: { status: 'PUBLISHED' },
      take: 10,
    });
    return { success: true, data: items };
  }

  async trailer(id: string) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['mediaAssets'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    const trailer = movie.mediaAssets?.find((a) => a.assetType === 'TRAILER');
    return { success: true, data: trailer || null };
  }

  async create(dto: CreateMovieDto) {
    const movie = this.movieRepo.create(dto as any);
    await this.movieRepo.save(movie);
    return { success: true, data: movie };
  }
}
