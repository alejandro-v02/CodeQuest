import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// The owner is also stored as a member, so every "who is in this group"
// query (leaderboard, counts) is a single table.
@Entity('group_members')
@Index(['groupId', 'userId'], { unique: true })
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @CreateDateColumn()
  joinedAt: Date;
}
