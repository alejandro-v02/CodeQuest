import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';
import { GenerationService } from '../generation/generation.service';
import { TemplateGeneratorService } from '../generation/templates/template-generator.service';
import { Exercise } from './entities/exercise.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import type { ExerciseDetail } from './exercises.types';
import { ExercisesService } from './exercises.service';

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
const DEFAULT_DIFFICULTY = 1;
// Streak length (consecutive passed/failed) needed to move difficulty a
// step — one lucky/unlucky answer shouldn't swing it.
const STREAK_TO_ADAPT = 2;
// Once fewer than this many unseen approved exercises remain at a concept/
// difficulty pair, a backfill job is enqueued so the bank doesn't run dry.
const LOW_WATERMARK = 2;
const QUIZ_TEMPLATE_KEY = 'variable-arithmetic';

@Injectable()
export class NextExerciseService {
  private readonly logger = new Logger(NextExerciseService.name);

  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(UserExerciseHistory)
    private readonly historyRepo: Repository<UserExerciseHistory>,
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
    private readonly generationService: GenerationService,
    private readonly templateGeneratorService: TemplateGeneratorService,
    private readonly exercisesService: ExercisesService,
  ) {}

  async getNext(userId: string, conceptId: string): Promise<ExerciseDetail> {
    const concept = await this.conceptRepo.findOne({
      where: { id: conceptId },
    });
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }

    const difficulty = await this.resolveDifficulty(userId, conceptId);
    const seenIds = await this.getSeenExerciseIds(userId, conceptId);

    let candidate = await this.pickApproved(conceptId, difficulty, seenIds);
    if (!candidate) {
      candidate = await this.pickApproved(
        conceptId,
        difficulty,
        seenIds,
        Math.max(MIN_DIFFICULTY, difficulty - 1),
        Math.min(MAX_DIFFICULTY, difficulty + 1),
      );
    }

    if (!candidate) {
      // Bank is empty of unseen exercises for this concept entirely — queue
      // a backfill for next time and generate a free, instant quiz now so
      // the request never dead-ends.
      this.backfill(conceptId, difficulty);
      candidate = await this.templateGeneratorService.generateQuiz(
        conceptId,
        QUIZ_TEMPLATE_KEY,
      );
    } else {
      await this.maybeBackfill(conceptId, difficulty, seenIds);
    }

    await this.historyRepo.save(
      this.historyRepo.create({
        userId,
        exerciseId: candidate.id,
        conceptId,
        outcome: 'served',
      }),
    );

    return this.exercisesService.getExercise(candidate.id, userId);
  }

  private async pickApproved(
    conceptId: string,
    exactDifficulty: number,
    excludeIds: string[],
    rangeMin?: number,
    rangeMax?: number,
  ): Promise<Exercise | null> {
    const qb = this.exerciseRepo
      .createQueryBuilder('exercise')
      .where('exercise.concept_id = :conceptId', { conceptId })
      .andWhere('exercise.status = :status', { status: 'approved' });

    if (rangeMin !== undefined && rangeMax !== undefined) {
      qb.andWhere('exercise.difficulty BETWEEN :min AND :max', {
        min: rangeMin,
        max: rangeMax,
      });
    } else {
      qb.andWhere('exercise.difficulty = :difficulty', {
        difficulty: exactDifficulty,
      });
    }

    if (excludeIds.length > 0) {
      qb.andWhere('exercise.id NOT IN (:...excludeIds)', { excludeIds });
    }

    return qb.orderBy('RANDOM()').limit(1).getOne();
  }

  private async maybeBackfill(
    conceptId: string,
    difficulty: number,
    excludeIds: string[],
  ): Promise<void> {
    const remaining = await this.exerciseRepo
      .createQueryBuilder('exercise')
      .where('exercise.concept_id = :conceptId', { conceptId })
      .andWhere('exercise.status = :status', { status: 'approved' })
      .andWhere('exercise.difficulty = :difficulty', { difficulty })
      .andWhere(
        excludeIds.length > 0 ? 'exercise.id NOT IN (:...excludeIds)' : '1=1',
        {
          excludeIds,
        },
      )
      .getCount();

    if (remaining <= LOW_WATERMARK) {
      this.backfill(conceptId, difficulty);
    }
  }

  // Fire-and-forget: a failed enqueue shouldn't fail the "next exercise"
  // request, but it's still worth logging instead of swallowing silently.
  private backfill(conceptId: string, difficulty: number): void {
    this.generationService
      .enqueueBackfill(conceptId, difficulty)
      .catch((error: unknown) => {
        this.logger.warn(
          `Failed to enqueue backfill for concept ${conceptId} @ difficulty ${difficulty}: ` +
            (error instanceof Error ? error.message : String(error)),
        );
      });
  }

  private async getSeenExerciseIds(
    userId: string,
    conceptId: string,
  ): Promise<string[]> {
    const rows = await this.historyRepo.find({
      where: { userId, conceptId },
      select: { exerciseId: true },
    });
    return rows.map((row) => row.exerciseId);
  }

  // Looks at the most recent passed/failed outcomes for this concept and
  // nudges difficulty up/down after a streak — a single lucky or unlucky
  // answer shouldn't move it.
  private async resolveDifficulty(
    userId: string,
    conceptId: string,
  ): Promise<number> {
    const recent = await this.historyRepo.find({
      where: { userId, conceptId, outcome: Not('served') },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    if (recent.length === 0) {
      return DEFAULT_DIFFICULTY;
    }

    const exercises = await this.exerciseRepo.find({
      where: { id: In(recent.map((row) => row.exerciseId)) },
    });
    const difficultyById = new Map(
      exercises.map((exercise) => [exercise.id, exercise.difficulty]),
    );
    const lastDifficulty =
      difficultyById.get(recent[0].exerciseId) ?? DEFAULT_DIFFICULTY;

    const streakOutcome = recent[0].outcome;
    let streak = 0;
    for (const entry of recent) {
      if (entry.outcome !== streakOutcome) {
        break;
      }
      streak += 1;
    }

    if (streakOutcome === 'passed' && streak >= STREAK_TO_ADAPT) {
      return Math.min(MAX_DIFFICULTY, lastDifficulty + 1);
    }
    if (streakOutcome === 'failed' && streak >= STREAK_TO_ADAPT) {
      return Math.max(MIN_DIFFICULTY, lastDifficulty - 1);
    }
    return lastDifficulty;
  }
}
