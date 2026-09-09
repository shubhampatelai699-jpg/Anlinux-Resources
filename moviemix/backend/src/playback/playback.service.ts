import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaybackSession } from './entities/playback-session.entity';
import { PlaybackSessionDto } from './dto/playback-session.dto';
import { Movie } from '../movies/entities/movie.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Injectable()
export class PlaybackService {
  constructor(
    @InjectRepository(PlaybackSession)
    private readonly sessionRepo: Repository<PlaybackSession>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
  ) {}

  async createSession(userId: string, dto: PlaybackSessionDto) {
    const entity =
      dto.contentType === 'MOVIE'
        ? await this.movieRepo.findOne({ where: { id: dto.contentId } })
        : await this.episodeRepo.findOne({ where: { id: dto.contentId } });

    if (!entity) throw new NotFoundException('Content not found');
    if (entity.status !== 'PUBLISHED')
      throw new ForbiddenException('Content unavailable');

    // TODO: entitlement check for premium/subscription content

    const session = this.sessionRepo.create({
      userId,
      contentType: dto.contentType,
      contentId: dto.contentId,
      protocol: 'HLS',
      manifestUrl: 'https://cdn.example.com/signed/master.m3u8',
      startedAt: new Date(),
    });
    await this.sessionRepo.save(session);

    return {
      success: true,
      data: {
        sessionId: session.id,
        protocol: session.protocol,
        manifestUrl: session.manifestUrl,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        audioTracks: [],
        subtitles: [],
      },
    };
  }
}
