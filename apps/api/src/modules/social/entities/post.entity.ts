import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type PostType = 'text' | 'achievement' | 'level_up' | 'solved_exercise';

// authorId/exerciseId are explicitly typed uuid (unlike XpEvent.userId,
// Streak.userId, UserAchievement.userId, Attempt.userId, which are all
// un-typed varchar) so joins back to `users` never need the
// CAST(... AS varchar) workaround documented in getWeeklyRanking.
@Entity('posts')
@Index(['authorId', 'createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  authorId: string;

  @Column({ type: 'varchar' })
  type: PostType;

  // Free text ('text') or a caption ('solved_exercise'). Never populated for
  // automatic 'achievement'/'level_up' posts — their display copy is
  // resolved client-side from ACHIEVEMENTS_CATALOG / the level number.
  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'text', nullable: true })
  codeSnippet: string | null;

  @Column({ type: 'uuid', nullable: true })
  exerciseId: string | null;

  // Denormalized snapshot — the exercise's title/content can change later.
  @Column({ type: 'varchar', nullable: true })
  exerciseTitle: string | null;

  @Column({ type: 'varchar', nullable: true })
  achievementSlug: string | null;

  @Column({ type: 'int', nullable: true })
  level: number | null;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
