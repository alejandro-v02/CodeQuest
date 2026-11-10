import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// A "ficha": a class/group led by one owner (typically an instructor) whose
// members share a leaderboard and a progress dashboard. Anyone can create one
// — there is no separate instructor role to administer.
@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  // Short code the owner shares so people can join. Uppercase, unique.
  @Column({ type: 'varchar', length: 8, unique: true })
  code: string;

  @Column({ type: 'uuid' })
  @Index()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;
}
