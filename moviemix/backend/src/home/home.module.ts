import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { Genre } from '../genres/entities/genre.entity';
import { WatchProgress } from '../watch-progress/entities/watch-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Series, Genre, WatchProgress])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
