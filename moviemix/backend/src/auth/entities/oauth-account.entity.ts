import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('oauth_accounts')
@Unique(['provider', 'providerUserId'])
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 50 })
  provider: string;

  @Column({ name: 'provider_user_id', length: 255 })
  providerUserId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.oauthAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
