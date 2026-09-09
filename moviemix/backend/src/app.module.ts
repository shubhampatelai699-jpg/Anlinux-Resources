import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SeriesModule } from './series/series.module';
import { SeasonsModule } from './seasons/seasons.module';
import { EpisodesModule } from './episodes/episodes.module';
import { GenresModule } from './genres/genres.module';
import { SearchModule } from './search/search.module';
import { HomeModule } from './home/home.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { WatchProgressModule } from './watch-progress/watch-progress.module';
import { PlaybackModule } from './playback/playback.module';
import { MediaModule } from './media/media.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    SeriesModule,
    SeasonsModule,
    EpisodesModule,
    GenresModule,
    SearchModule,
    HomeModule,
    WatchlistModule,
    WatchHistoryModule,
    WatchProgressModule,
    PlaybackModule,
    MediaModule,
    RecommendationsModule,
    AdminModule,
  ],
})
export class AppModule {}
