import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('follows')
@Index(['followerId', 'followeeId'], { unique: true })
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  followerId: string;

  @Column({ type: 'uuid' })
  @Index()
  followeeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
