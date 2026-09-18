import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('playback_sessions')
export class PlaybackSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'content_type', type: 'enum', enum: ['MOVIE', 'EPISODE'] })
  contentType: string;

  @Column({ name: 'content_id' })
  contentId: string;

  @Column({ name: 'manifest_url', nullable: true })
  manifestUrl: string;

  @Column({ type: 'enum', enum: ['HLS', 'DASH'], nullable: true })
  protocol: string;

  @Column({ name: 'device_id', length: 255, nullable: true })
  deviceId: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'last_heartbeat_at', type: 'timestamptz', nullable: true })
  lastHeartbeatAt: Date;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
