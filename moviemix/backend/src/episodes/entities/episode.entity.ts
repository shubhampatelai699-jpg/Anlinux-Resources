import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Season } from '../../seasons/entities/season.entity';
import { MediaAsset } from '../../media/entities/media-asset.entity';

@Entity('episodes')
@Unique(['seasonId', 'episodeNumber'])
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'season_id' })
  seasonId: string;

  @Column({ name: 'episode_number' })
  episodeNumber: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'runtime_seconds', nullable: true })
  runtimeSeconds: number;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ name: 'content_tier', length: 30, default: 'FREE' })
  contentTier: string;

  @Column({ type: 'enum', enum: ['DRAFT', 'PROCESSING', 'READY', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
  status: string;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Season, (season) => season.episodes)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @OneToMany(() => MediaAsset, (asset) => asset.episode)
  mediaAssets: MediaAsset[];
}
