import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VideoAsset } from './video-asset.entity';

@Entity('subtitle_assets')
export class SubtitleAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'video_asset_id' })
  videoAssetId: string;

  @Column({ name: 'language_code', length: 10 })
  languageCode: string;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column({ length: 20 })
  format: string;

  @Column({ name: 'storage_key' })
  storageKey: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => VideoAsset, (video) => video.subtitles)
  @JoinColumn({ name: 'video_asset_id' })
  videoAsset: VideoAsset;
}
