import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaAsset } from './entities/media-asset.entity';
import { VideoAsset } from './entities/video-asset.entity';
import { SubtitleAsset } from './entities/subtitle-asset.entity';
import { AudioTrack } from './entities/audio-track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MediaAsset,
      VideoAsset,
      SubtitleAsset,
      AudioTrack,
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
