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
import { Series } from '../../series/entities/series.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('seasons')
@Unique(['seriesId', 'seasonNumber'])
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'series_id' })
  seriesId: string;

  @Column({ name: 'season_number' })
  seasonNumber: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Series, (series) => series.seasons)
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];
}
