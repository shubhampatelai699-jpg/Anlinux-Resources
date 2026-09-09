import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaybackController } from './playback.controller';
import { PlaybackService } from './playback.service';
import { PlaybackSession } from './entities/playback-session.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaybackSession, Movie, Episode])],
  controllers: [PlaybackController],
  providers: [PlaybackService],
  exports: [PlaybackService],
})
export class PlaybackModule {}
