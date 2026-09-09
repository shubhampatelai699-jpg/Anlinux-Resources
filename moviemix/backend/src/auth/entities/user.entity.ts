import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OAuthAccount } from './oauth-account.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ name: 'display_name', length: 120, nullable: true })
  displayName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' })
  role: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'SUSPENDED', 'DELETED'], default: 'ACTIVE' })
  status: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => OAuthAccount, (oauth) => oauth.user)
  oauthAccounts: OAuthAccount[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
}
