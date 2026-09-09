import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Movie } from '../movies/entities/movie.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Episode, User])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
