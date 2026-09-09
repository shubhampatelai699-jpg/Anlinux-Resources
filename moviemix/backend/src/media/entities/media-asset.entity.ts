import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VideoAsset } from './video-asset.entity';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_type', type: 'enum', enum: ['MOVIE', 'SERIES', 'EPISODE'] })
  ownerType: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column({ name: 'asset_type', type: 'enum', enum: ['POSTER', 'BACKDROP', 'THUMBNAIL', 'TRAILER', 'VIDEO', 'SUBTITLE', 'AUDIO'] })
  assetType: string;

  @Column({ name: 'storage_key' })
  storageKey: string;

  @Column({ name: 'cdn_url', nullable: true })
  cdnUrl: string;

  @Column({ name: 'mime_type', length: 150, nullable: true })
  mimeType: string;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes: number;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @Column({ length: 20, nullable: true })
  language: string;

  @Column({ type: 'enum', enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'], default: 'READY' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => VideoAsset, (video) => video.mediaAsset)
  videoAssets: VideoAsset[];
}
