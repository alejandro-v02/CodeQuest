import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';
import { GenerationService } from '../generation/generation.service';
import { TemplateGeneratorService } from '../generation/templates/template-generator.service';
import {
  User,
  type ProgrammingLanguageSlug,
} from '../users/entities/user.entity';
import { Attempt } from './entities/attempt.entity';
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
// Chance that "next" re-serves an exercise the user failed or skipped even
// though fresh ones remain.
const RETRY_UNSOLVED_CHANCE = 1 / 3;
// Tries when the bank is empty and an exercise has to be generated live.
const GENERATE_ON_DEMAND_ATTEMPTS = 2;

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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly generationService: GenerationService,
    private readonly templateGeneratorService: TemplateGeneratorService,
    private readonly exercisesService: ExercisesService,
  ) {}

  async getNext(userId: string, conceptId: string): Promise<ExerciseDetail> {
    const concept = await this.conceptRepo.findOne({
      where: { id: conceptId },
      relations: { language: true },
    });
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }

    const difficulty = await this.resolveDifficulty(userId, conceptId);
    // Lesson exercises also feed Práctica libre, but only the ones this user
    // can already open: serving one from a locked lesson would be refused as
    // soon as they tried to open or submit it.
    const lockedIds = await this.getLockedLessonExerciseIds(
      conceptId,
      concept.language.slug,
      userId,
    );
    // A solved exercise never comes back; one that was served but not solved
    // keeps coming back until it is.
    const solvedIds = await this.getSolvedExerciseIds(userId, conceptId);
    const servedIds = await this.getServedExerciseIds(userId, conceptId);
    const solvedSet = new Set(solvedIds);
    const unsolvedServedIds = servedIds.filter((id) => !solvedSet.has(id));
    // Fresh exercises come first; the unsolved ones only fill in when
    // nothing new is left, plus an occasional retry so a skipped exercise
    // doesn't wait until the whole bank is exhausted.
    const retryUnsolved =
      unsolvedServedIds.length > 0 && Math.random() < RETRY_UNSOLVED_CHANCE;
    const freshExclude = [...solvedIds, ...servedIds, ...lockedIds];
    const reuseExclude = [...solvedIds, ...lockedIds];

    let candidate: Exercise | null = null;
    if (retryUnsolved) {
      candidate = await this.pickApproved(
        conceptId,
        difficulty,
        reuseExclude,
        undefined,
        undefined,
        unsolvedServedIds,
      );
    }
    const attempts: Array<[string[], number?, number?]> = [
      [freshExclude],
      [
        freshExclude,
        Math.max(MIN_DIFFICULTY, difficulty - 1),
        Math.min(MAX_DIFFICULTY, difficulty + 1),
      ],
      [reuseExclude],
      [
        reuseExclude,
        Math.max(MIN_DIFFICULTY, difficulty - 1),
        Math.min(MAX_DIFFICULTY, difficulty + 1),
      ],
    ];
    for (const [exclude, min, max] of attempts) {
      if (candidate) {
        break;
      }
      candidate = await this.pickApproved(
        conceptId,
        difficulty,
        exclude,
        min,
        max,
      );
    }
    const excludeIds = freshExclude;

    if (!candidate) {
      // Bank is empty of unseen exercises for this concept entirely — queue
      // a backfill for next time and generate a free, instant quiz now so
      // the request never dead-ends.
      this.backfill(conceptId, difficulty);
      candidate = await this.generateOnTopic(concept, difficulty);
    } else {
      await this.maybeBackfill(conceptId, difficulty, excludeIds);
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

  // Nothing left in the bank for this concept: make one on the spot so the
  // user always gets an exercise about what they picked. The arithmetic quiz
  // template only talks about variables, so it is a fallback for that concept
  // alone — anywhere else it would be off-topic.
  private async generateOnTopic(
    concept: Concept,
    difficulty: number,
  ): Promise<Exercise> {
    for (let attempt = 0; attempt < GENERATE_ON_DEMAND_ATTEMPTS; attempt += 1) {
      try {
        const result = await this.generationService.generateCodeExercise(
          concept.id,
          difficulty,
        );
        if (result.outcome === 'approved' && result.exerciseId) {
          const exercise = await this.exerciseRepo.findOne({
            where: { id: result.exerciseId },
          });
          if (exercise) {
            return exercise;
          }
        }
      } catch (error) {
        this.logger.warn(
          `On-demand generation for concept "${concept.slug}" failed: ` +
            (error instanceof Error ? error.message : String(error)),
        );
        break;
      }
    }
    if (concept.slug === 'variables') {
      return this.templateGeneratorService.generateQuiz(
        concept.id,
        QUIZ_TEMPLATE_KEY,
      );
    }
    throw new ServiceUnavailableException(
      'Ya completaste los ejercicios de este tema por ahora. Vuelve pronto: estamos preparando más.',
    );
  }

  private async getLockedLessonExerciseIds(
    conceptId: string,
    languageSlug: ProgrammingLanguageSlug,
    userId: string,
  ): Promise<string[]> {
    const lockedLessonIds = await this.exercisesService.getLockedLessonIds(
      languageSlug,
      userId,
    );
    if (lockedLessonIds.length === 0) {
      return [];
    }
    const locked = await this.exerciseRepo.find({
      where: { conceptId, lessonId: In(lockedLessonIds) },
      select: { id: true },
    });
    return locked.map((exercise) => exercise.id);
  }

  private async pickApproved(
    conceptId: string,
    exactDifficulty: number,
    excludeIds: string[],
    rangeMin?: number,
    rangeMax?: number,
    onlyIds?: string[],
  ): Promise<Exercise | null> {
    const qb = this.exerciseRepo
      .createQueryBuilder('exercise')
      .where('exercise.concept_id = :conceptId', { conceptId })
      .andWhere('exercise.status = :status', { status: 'approved' });

    if (onlyIds) {
      qb.andWhere('exercise.id IN (:...onlyIds)', { onlyIds });
    }

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

  // Every exercise of this concept already served to the user (solved or not).
  private async getServedExerciseIds(
    userId: string,
    conceptId: string,
  ): Promise<string[]> {
    const rows = await this.historyRepo.find({
      where: { userId, conceptId },
      select: { exerciseId: true },
    });
    return [...new Set(rows.map((row) => row.exerciseId))];
  }

  // Exercises of this concept the user has passed — through Práctica libre
  // or, for lesson exercises linked to the concept, through the lesson.
  private async getSolvedExerciseIds(
    userId: string,
    conceptId: string,
  ): Promise<string[]> {
    const rows: Array<{ exercise_id: string }> = await this.exerciseRepo.manager
      .createQueryBuilder()
      .select('DISTINCT attempt.exercise_id', 'exercise_id')
      .from(Attempt, 'attempt')
      .innerJoin(
        Exercise,
        'exercise',
        'exercise.id::text = attempt.exercise_id::text',
      )
      .where('attempt.user_id::text = :userId', { userId })
      .andWhere('attempt.passed = true')
      .andWhere('exercise.concept_id = :conceptId', { conceptId })
      .getRawMany();
    return rows.map((row) => row.exercise_id);
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
      // No history yet for this concept — use the Fase 5B placement test's
      // result (if the user took one) instead of always starting at 1.
      const user = await this.userRepo.findOne({ where: { id: userId } });
      return user?.placementDifficulty ?? DEFAULT_DIFFICULTY;
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
