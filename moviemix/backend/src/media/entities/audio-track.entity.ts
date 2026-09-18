import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VideoAsset } from './video-asset.entity';

@Entity('audio_tracks')
export class AudioTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'video_asset_id' })
  videoAssetId: string;

  @Column({ name: 'language_code', length: 10 })
  languageCode: string;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column({ length: 50, nullable: true })
  codec: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => VideoAsset, (video) => video.audioTracks)
  @JoinColumn({ name: 'video_asset_id' })
  videoAsset: VideoAsset;
}
