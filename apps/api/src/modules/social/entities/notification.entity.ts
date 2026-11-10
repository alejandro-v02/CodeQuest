import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type NotificationType = 'follow' | 'reaction' | 'comment';

@Entity('notifications')
@Index(['recipientId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  recipientId: string;

  @Column({ type: 'uuid' })
  actorId: string;

  @Column({ type: 'varchar' })
  type: NotificationType;

  @Column({ type: 'uuid', nullable: true })
  postId: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
