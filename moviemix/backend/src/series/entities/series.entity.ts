import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Season } from '../../seasons/entities/season.entity';
import { MediaAsset } from '../../media/entities/media-asset.entity';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 280, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ name: 'age_rating', length: 20, nullable: true })
  ageRating: string;

  @Column({ length: 20, nullable: true })
  language: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ name: 'content_tier', length: 30, default: 'FREE' })
  contentTier: string;

  @Column({ type: 'enum', enum: ['DRAFT', 'PROCESSING', 'READY', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
  status: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Genre, (genre) => genre.series)
  @JoinTable({
    name: 'series_genres',
    joinColumn: { name: 'series_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @OneToMany(() => Season, (season) => season.series)
  seasons: Season[];

  @OneToMany(() => MediaAsset, (asset) => asset.series)
  mediaAssets: MediaAsset[];
}
