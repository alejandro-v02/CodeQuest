import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ReactionIcon = 'flame' | 'flash' | 'rocket' | 'thumbs_up';

// One reaction per user per post — "changing" a reaction updates this row
// rather than stacking a new one (see the unique index below).
@Entity('post_reactions')
@Index(['postId', 'userId'], { unique: true })
export class PostReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  icon: ReactionIcon;

  @CreateDateColumn()
  createdAt: Date;
}
