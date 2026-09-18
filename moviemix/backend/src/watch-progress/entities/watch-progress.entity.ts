import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('watch_progress')
@Unique(['userId', 'contentType', 'contentId'])
export class WatchProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'content_type' })
  contentType: string;

  @Column({ name: 'content_id' })
  contentId: string;

  @Column({ name: 'position_seconds', type: 'bigint', default: 0 })
  positionSeconds: number;

  @Column({ name: 'duration_seconds', type: 'bigint', nullable: true })
  durationSeconds: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'last_watched_at', type: 'timestamptz' })
  lastWatchedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
