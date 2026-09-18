import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Series])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
