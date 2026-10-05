import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SeriesModule } from './series/series.module';
import { GenresModule } from './genres/genres.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { HistoryModule } from './history/history.module';
import { PlaybackModule } from './playback/playback.module';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    MoviesModule,
    SeriesModule,
    GenresModule,
    WatchlistModule,
    HistoryModule,
    PlaybackModule,
    SearchModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
