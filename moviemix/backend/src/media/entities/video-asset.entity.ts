import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { MediaAsset } from './media-asset.entity';
import { SubtitleAsset } from './subtitle-asset.entity';
import { AudioTrack } from './audio-track.entity';

@Entity('video_assets')
export class VideoAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'media_asset_id' })
  mediaAssetId: string;

  @Column({ type: 'enum', enum: ['HLS', 'DASH'] })
  protocol: string;

  @Column({ name: 'manifest_url' })
  manifestUrl: string;

  @Column({ name: 'drm_type', length: 30, nullable: true })
  drmType: string;

  @Column({ type: 'enum', enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'], default: 'READY' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => MediaAsset, (asset) => asset.videoAssets)
  @JoinColumn({ name: 'media_asset_id' })
  mediaAsset: MediaAsset;

  @OneToMany(() => SubtitleAsset, (subtitle) => subtitle.videoAsset)
  subtitles: SubtitleAsset[];

  @OneToMany(() => AudioTrack, (track) => track.videoAsset)
  audioTracks: AudioTrack[];
}
