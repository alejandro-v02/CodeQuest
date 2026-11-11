import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';
import { CoursesService } from '../courses/courses.service';
import { GamificationService } from '../gamification/gamification.service';
import { PistonService } from '../execution/piston.service';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { Exercise } from './entities/exercise.entity';
import type {
  BugPayload,
  ExercisePayload,
  FillPayload,
  QuizPayload,
  SortPayload,
} from './entities/exercise.entity';
import { TestCase } from './entities/test-case.entity';
import { Attempt } from './entities/attempt.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import { ExerciseReport } from './entities/exercise-report.entity';
import type { ExerciseReportReason } from './entities/exercise-report.entity';
import { ExerciseRecalibrationService } from './exercise-recalibration.service';
import type { SubmitAnswerDto } from './dto/submit-answer.dto';
import type {
  AdminExerciseStat,
  AnswerSubmitResult,
  ConceptStat,
  ConceptStatSummary,
  ExerciseDetail,
  ExercisePayloadView,
  ExerciseSummary,
  RunResult,
  StatsSummary,
  SubmitResult,
  TestCaseResult,
} from './exercises.types';

// Expected output is compared trimmed, since a trailing newline from
// print()/console.log() shouldn't make an otherwise-correct answer fail.
function normalize(output: string): string {
  return output.replace(/\r\n/g, '\n').trim();
}

// Fase 5B "conceptos débiles": needs a few real attempts before a pass rate
// is trusted, and a weak concept is one the user fails more than it passes.
const MIN_ATTEMPTS_FOR_WEAK = 3;
const WEAK_PASS_RATE = 0.5;
// Fase 7 "temas fuertes": symmetric threshold to isWeak, same minimum
// attempts so a lucky single pass doesn't count as "strong".
const STRONG_PASS_RATE = 0.8;

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(TestCase)
    private readonly testCaseRepo: Repository<TestCase>,
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    @InjectRepository(UserExerciseHistory)
    private readonly historyRepo: Repository<UserExerciseHistory>,
    @InjectRepository(ExerciseReport)
    private readonly reportRepo: Repository<ExerciseReport>,
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
    private readonly coursesService: CoursesService,
    private readonly gamificationService: GamificationService,
    private readonly pistonService: PistonService,
    private readonly recalibrationService: ExerciseRecalibrationService,
  ) {}

  async getExercisesForLesson(
    lessonId: string,
    userId: string,
  ): Promise<ExerciseSummary[]> {
    // Throws NotFoundException/ForbiddenException if the lesson doesn't
    // exist or is locked for this user — exercises inherit that check.
    await this.coursesService.getLessonDetail(lessonId, userId);

    const exercises = await this.exerciseRepo.find({
      where: { lessonId },
      order: { order: 'ASC' },
    });
    const solvedIds = await this.getSolvedExerciseIds(
      userId,
      exercises.map((exercise) => exercise.id),
    );

    return exercises.map((exercise) => ({
      id: exercise.id,
      order: exercise.order,
      type: exercise.type,
      prompt: exercise.prompt,
      difficulty: exercise.difficulty,
      solved: solvedIds.has(exercise.id),
    }));
  }

  // Ids of the lessons this user can't open yet. Práctica libre uses it to
  // avoid serving an exercise that getExercise/submitAnswer would then refuse.
  async getLockedLessonIds(
    languageSlug: ProgrammingLanguageSlug,
    userId: string,
  ): Promise<string[]> {
    const overview = await this.coursesService.getPathOverview(
      languageSlug,
      userId,
    );
    return overview.modules
      .flatMap((courseModule) => courseModule.lessons)
      .filter((lesson) => lesson.status === 'locked')
      .map((lesson) => lesson.id);
  }

  async getExercise(
    exerciseId: string,
    userId: string,
  ): Promise<ExerciseDetail> {
    const exercise = await this.findExerciseOrThrow(exerciseId);
    const languageSlug = await this.resolveLanguageSlug(exercise, userId);

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId, isHidden: false },
      order: { order: 'ASC' },
    });
    const solvedIds = await this.getSolvedExerciseIds(userId, [exerciseId]);

    return {
      id: exercise.id,
      lessonId: exercise.lessonId,
      languageSlug,
      order: exercise.order,
      type: exercise.type,
      prompt: exercise.prompt,
      starterCode: exercise.starterCode,
      payload: this.sanitizePayload(exercise.type, exercise.payload),
      difficulty: exercise.difficulty,
      solved: solvedIds.has(exercise.id),
      testCases: testCases.map((testCase) => ({
        id: testCase.id,
        order: testCase.order,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })),
    };
  }

  // "Ejecutar": quick feedback against the visible cases only, nothing
  // persisted.
  async runCode(
    exerciseId: string,
    userId: string,
    code: string,
  ): Promise<RunResult> {
    const exercise = await this.findExerciseOrThrow(exerciseId);
    if (exercise.type !== 'code') {
      throw new BadRequestException(
        'Este tipo de ejercicio no tiene vista previa, usa "Comprobar".',
      );
    }
    const languageSlug = await this.resolveLanguageSlug(exercise, userId);

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId, isHidden: false },
      order: { order: 'ASC' },
    });

    const results = await this.runAgainst(languageSlug, code, testCases);

    return {
      allPassed: results.every((result) => result.passed),
      testCases: results,
    };
  }

  // Dispatches "Enviar"/"Comprobar" by exercise type: 'code' runs the
  // sandbox against every TestCase, the Fase 4B types are graded structurally
  // against the stored payload instead (see each submitX helper below).
  async submitAnswer(
    exerciseId: string,
    userId: string,
    dto: SubmitAnswerDto,
  ): Promise<SubmitResult | AnswerSubmitResult> {
    const exercise = await this.findExerciseOrThrow(exerciseId);
    if (exercise.lessonId) {
      // Throws if the lesson is locked/missing — exercises inherit that
      // check. Concept-only (Fase 5A-generated) exercises have no lesson to
      // check against.
      await this.coursesService.getLessonDetail(exercise.lessonId, userId);
    }

    const result = await this.dispatchSubmit(exercise, userId, dto);
    const passed = 'allPassed' in result ? result.allPassed : result.passed;

    if (passed) {
      await this.gamificationService.awardExerciseXp(userId, exercise.id);
    }

    if (exercise.conceptId) {
      // Fase 5A "next exercise" serving reads this back to exclude seen
      // exercises and adapt difficulty — only concept-scoped (Fase 5A)
      // exercises are tracked here, lesson exercises use Attempt only.
      await this.historyRepo.update(
        { userId, exerciseId: exercise.id },
        { outcome: passed ? 'passed' : 'failed' },
      );
      // Fire-and-forget: recalibration reads history/reports back from the
      // DB, it doesn't need to block the response to the user.
      this.recalibrationService.recalibrate(exercise.id).catch((error) => {
        console.error('Exercise recalibration failed:', error);
      });
    }

    return result;
  }

  async reportExercise(
    userId: string,
    exerciseId: string,
    reason: ExerciseReportReason,
    details: string | undefined,
  ): Promise<void> {
    await this.findExerciseOrThrow(exerciseId);
    await this.reportRepo.save(
      this.reportRepo.create({
        userId,
        exerciseId,
        reason,
        details: details ?? null,
      }),
    );
    this.recalibrationService.recalibrate(exerciseId).catch((error) => {
      console.error('Exercise recalibration failed:', error);
    });
  }

  // Fase 5A.4 admin panel: per-language/concept counts of Fase 5A-generated
  // exercises by status. Exercises without a concept (Fase 3/4, hand-
  // authored) don't use this status model and are excluded.
  async getAdminStats(): Promise<AdminExerciseStat[]> {
    const rows = await this.exerciseRepo
      .createQueryBuilder('exercise')
      .innerJoin('exercise.concept', 'concept')
      .innerJoin('concept.language', 'language')
      .where('exercise.conceptId IS NOT NULL')
      .select('language.slug', 'languageSlug')
      .addSelect('language.name', 'languageName')
      .addSelect('concept.slug', 'conceptSlug')
      .addSelect('concept.name', 'conceptName')
      .addSelect('exercise.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('language.slug')
      .addGroupBy('language.name')
      .addGroupBy('concept.slug')
      .addGroupBy('concept.name')
      .addGroupBy('exercise.status')
      .orderBy('language.name', 'ASC')
      .addOrderBy('concept.name', 'ASC')
      .getRawMany<{
        languageSlug: ProgrammingLanguageSlug;
        languageName: string;
        conceptSlug: string;
        conceptName: string;
        status: 'approved' | 'rejected' | 'retired';
        count: string;
      }>();

    const byConcept = new Map<string, AdminExerciseStat>();
    for (const row of rows) {
      const key = `${row.languageSlug}:${row.conceptSlug}`;
      let stat = byConcept.get(key);
      if (!stat) {
        stat = {
          languageSlug: row.languageSlug,
          languageName: row.languageName,
          conceptSlug: row.conceptSlug,
          conceptName: row.conceptName,
          approved: 0,
          rejected: 0,
          retired: 0,
          total: 0,
        };
        byConcept.set(key, stat);
      }
      const count = Number(row.count);
      stat[row.status] += count;
      stat.total += count;
    }

    return [...byConcept.values()];
  }

  // Fase 5B "conceptos débiles": per-concept pass rate for this user in this
  // language, read by Práctica libre to sort/flag concepts worth reinforcing.
  async getConceptStats(
    userId: string,
    languageSlug: ProgrammingLanguageSlug,
  ): Promise<ConceptStat[]> {
    const rows = await this.historyRepo
      .createQueryBuilder('history')
      // UserExerciseHistory.conceptId is a plain varchar (it's a bookkeeping
      // entity with no relations), while concepts.id is uuid — needs an
      // explicit cast or Postgres rejects the join outright.
      .innerJoin('concepts', 'concept', 'concept.id::text = history.concept_id')
      .innerJoin('languages', 'language', 'language.id = concept.language_id')
      .where('history.user_id = :userId', { userId })
      .andWhere('language.slug = :languageSlug', { languageSlug })
      .andWhere('history.outcome IN (:...outcomes)', {
        outcomes: ['passed', 'failed'],
      })
      .select('history.concept_id', 'conceptId')
      .addSelect('concept.name', 'conceptName')
      .addSelect('history.outcome', 'outcome')
      .addSelect('COUNT(*)', 'count')
      .groupBy('history.concept_id')
      .addGroupBy('concept.name')
      .addGroupBy('history.outcome')
      .getRawMany<{
        conceptId: string;
        conceptName: string;
        outcome: 'passed' | 'failed';
        count: string;
      }>();

    const byConcept = new Map<
      string,
      { conceptName: string; passed: number; failed: number }
    >();
    for (const row of rows) {
      const stat = byConcept.get(row.conceptId) ?? {
        conceptName: row.conceptName,
        passed: 0,
        failed: 0,
      };
      stat[row.outcome] += Number(row.count);
      byConcept.set(row.conceptId, stat);
    }

    return [...byConcept.entries()].map(
      ([conceptId, { conceptName, passed, failed }]) => {
        const total = passed + failed;
        const passRate = total === 0 ? null : passed / total;
        return {
          conceptId,
          conceptName,
          passRate,
          isWeak:
            total >= MIN_ATTEMPTS_FOR_WEAK &&
            passRate !== null &&
            passRate <= WEAK_PASS_RATE,
          isStrong:
            total >= MIN_ATTEMPTS_FOR_WEAK &&
            passRate !== null &&
            passRate >= STRONG_PASS_RATE,
        };
      },
    );
  }

  // Fase 7 "panel de progreso": exercisesSolved/accuracy/activeDays are
  // computed globally per user (not per language) — Attempt has no direct
  // language column, and resolving it per-row would need a dual join (via
  // Lesson or via Concept, see resolveLanguageSlug) for little real benefit
  // since most users only ever practice in their preferredLanguage.
  async getStatsSummary(
    userId: string,
    languageSlug: ProgrammingLanguageSlug,
  ): Promise<StatsSummary> {
    const totals = await this.attemptRepo
      .createQueryBuilder('attempt')
      .where('attempt.userId = :userId', { userId })
      .select(
        'COUNT(DISTINCT CASE WHEN attempt.passed THEN attempt.exerciseId END)',
        'exercisesSolved',
      )
      .addSelect('COUNT(*)', 'totalAttempts')
      .addSelect(
        'SUM(CASE WHEN attempt.passed THEN 1 ELSE 0 END)',
        'totalPassed',
      )
      .addSelect('COUNT(DISTINCT DATE(attempt.createdAt))', 'activeDays')
      .getRawOne<{
        exercisesSolved: string;
        totalAttempts: string;
        totalPassed: string;
        activeDays: string;
      }>();

    const totalAttempts = Number(totals?.totalAttempts ?? 0);
    const totalPassed = Number(totals?.totalPassed ?? 0);

    const conceptStats = await this.getConceptStats(userId, languageSlug);
    const toSummary = (stat: ConceptStat): ConceptStatSummary => ({
      conceptName: stat.conceptName,
      passRate: stat.passRate,
    });

    return {
      exercisesSolved: Number(totals?.exercisesSolved ?? 0),
      accuracy: totalAttempts === 0 ? null : totalPassed / totalAttempts,
      activeDays: Number(totals?.activeDays ?? 0),
      strongConcepts: conceptStats
        .filter((stat) => stat.isStrong)
        .sort((a, b) => (b.passRate ?? 0) - (a.passRate ?? 0))
        .slice(0, 3)
        .map(toSummary),
      weakConcepts: conceptStats
        .filter((stat) => stat.isWeak)
        .sort((a, b) => (a.passRate ?? 0) - (b.passRate ?? 0))
        .slice(0, 3)
        .map(toSummary),
    };
  }

  private async dispatchSubmit(
    exercise: Exercise,
    userId: string,
    dto: SubmitAnswerDto,
  ): Promise<SubmitResult | AnswerSubmitResult> {
    switch (exercise.type) {
      case 'code':
        if (dto.code === undefined) {
          throw new BadRequestException('Falta el código.');
        }
        return this.submitCode(exercise, userId, dto.code);
      case 'quiz':
        if (dto.selectedIndex === undefined) {
          throw new BadRequestException('Falta la opción seleccionada.');
        }
        return this.submitQuiz(exercise, userId, dto.selectedIndex);
      case 'fill':
        if (dto.answers === undefined) {
          throw new BadRequestException('Faltan las respuestas.');
        }
        return this.submitFill(exercise, userId, dto.answers);
      case 'sort':
        if (dto.order === undefined) {
          throw new BadRequestException('Falta el orden propuesto.');
        }
        return this.submitSort(exercise, userId, dto.order);
      case 'bug':
        if (dto.lineIndex === undefined) {
          throw new BadRequestException('Falta la línea seleccionada.');
        }
        return this.submitBug(exercise, userId, dto.lineIndex);
    }
  }

  // "Enviar": runs every case (visible + hidden) and records the attempt.
  private async submitCode(
    exercise: Exercise,
    userId: string,
    code: string,
  ): Promise<SubmitResult> {
    const exerciseId = exercise.id;
    const languageSlug = await this.resolveLanguageSlug(exercise, userId);

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId },
      order: { order: 'ASC' },
    });

    const results = await this.runAgainst(languageSlug, code, testCases);
    const allPassed = results.every((result) => result.passed);
    const firstError = results.find((result) => result.stderr)?.stderr ?? null;

    const attempt = await this.attemptRepo.save(
      this.attemptRepo.create({
        userId,
        exerciseId,
        code,
        passed: allPassed,
        output: JSON.stringify({
          passed: results.filter((result) => result.passed).length,
          total: results.length,
        }),
        errorMessage: firstError,
      }),
    );

    // Hidden cases never leak their input/expected/actual output, even on
    // submit — only whether the code passed them.
    const sanitized: TestCaseResult[] = results.map((result, index) => {
      const testCase = testCases[index];
      if (!testCase.isHidden) {
        return result;
      }
      return {
        id: result.id,
        passed: result.passed,
        input: null,
        expectedOutput: null,
        actualOutput: null,
        stderr: null,
      };
    });

    return { allPassed, testCases: sanitized, attemptId: attempt.id };
  }

  private async submitQuiz(
    exercise: Exercise,
    userId: string,
    selectedIndex: number,
  ): Promise<AnswerSubmitResult> {
    const payload = exercise.payload as QuizPayload;
    const passed = selectedIndex === payload.correctIndex;
    const attempt = await this.recordAnswerAttempt(
      exercise.id,
      userId,
      { selectedIndex },
      passed,
    );
    return {
      passed,
      attemptId: attempt.id,
      correctAnswer: payload.correctIndex,
      explanation: null,
    };
  }

  private async submitFill(
    exercise: Exercise,
    userId: string,
    answers: string[],
  ): Promise<AnswerSubmitResult> {
    const payload = exercise.payload as FillPayload;
    const passed =
      answers.length === payload.blanks.length &&
      payload.blanks.every(
        (blank, index) =>
          answers[index]?.trim().toLowerCase() === blank.trim().toLowerCase(),
      );
    const attempt = await this.recordAnswerAttempt(
      exercise.id,
      userId,
      { answers },
      passed,
    );
    return {
      passed,
      attemptId: attempt.id,
      correctAnswer: payload.blanks,
      explanation: null,
    };
  }

  private async submitSort(
    exercise: Exercise,
    userId: string,
    order: string[],
  ): Promise<AnswerSubmitResult> {
    const payload = exercise.payload as SortPayload;
    const passed =
      order.length === payload.blocks.length &&
      payload.blocks.every(
        (block, index) => order[index]?.trim() === block.trim(),
      );
    const attempt = await this.recordAnswerAttempt(
      exercise.id,
      userId,
      { order },
      passed,
    );
    return {
      passed,
      attemptId: attempt.id,
      correctAnswer: payload.blocks,
      explanation: null,
    };
  }

  private async submitBug(
    exercise: Exercise,
    userId: string,
    lineIndex: number,
  ): Promise<AnswerSubmitResult> {
    const payload = exercise.payload as BugPayload;
    const passed = lineIndex === payload.buggyLineIndex;
    const attempt = await this.recordAnswerAttempt(
      exercise.id,
      userId,
      { lineIndex },
      passed,
    );
    return {
      passed,
      attemptId: attempt.id,
      correctAnswer: payload.buggyLineIndex,
      explanation: payload.explanation,
    };
  }

  private async recordAnswerAttempt(
    exerciseId: string,
    userId: string,
    answer: Record<string, unknown>,
    passed: boolean,
  ): Promise<Attempt> {
    return this.attemptRepo.save(
      this.attemptRepo.create({
        userId,
        exerciseId,
        code: JSON.stringify(answer),
        passed,
        output: null,
        errorMessage: null,
      }),
    );
  }

  // Strips the correct-answer fields a client must never see before
  // submitting (correctIndex/blanks/buggyLineIndex/explanation), and shuffles
  // 'sort' blocks for display — see SortPayload's comment for why that's
  // enough to keep the answer hidden without any index bookkeeping.
  private sanitizePayload(
    type: Exercise['type'],
    payload: ExercisePayload | null,
  ): ExercisePayloadView | null {
    if (!payload) {
      return null;
    }
    switch (type) {
      case 'quiz': {
        const { code, options } = payload as QuizPayload;
        return { code, options };
      }
      case 'fill': {
        const { template, blanks } = payload as FillPayload;
        return { template, blankCount: blanks.length };
      }
      case 'sort': {
        const { blocks } = payload as SortPayload;
        return { blocks: this.shuffle(blocks) };
      }
      case 'bug': {
        const { lines } = payload as BugPayload;
        return { lines };
      }
      default:
        return null;
    }
  }

  private shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private async runAgainst(
    languageSlug: ProgrammingLanguageSlug,
    code: string,
    testCases: TestCase[],
  ): Promise<TestCaseResult[]> {
    const results: TestCaseResult[] = [];
    for (const testCase of testCases) {
      const execution = await this.pistonService.run(
        languageSlug,
        code,
        testCase.input,
      );
      const actualOutput = normalize(execution.stdout);
      const passed =
        execution.exitCode === 0 &&
        actualOutput === normalize(testCase.expectedOutput);

      results.push({
        id: testCase.id,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        stderr: execution.stderr || null,
      });
    }
    return results;
  }

  private async getSolvedExerciseIds(
    userId: string,
    exerciseIds: string[],
  ): Promise<Set<string>> {
    if (exerciseIds.length === 0) {
      return new Set();
    }
    const attempts = await this.attemptRepo.find({
      where: { userId, exerciseId: In(exerciseIds), passed: true },
    });
    return new Set(attempts.map((attempt) => attempt.exerciseId));
  }

  // Lesson-scoped (Fase 3/4) exercises resolve their language through their
  // lesson, which also doubles as the locked-lesson access check. Concept-
  // scoped (Fase 5A-generated) exercises have no lesson to check against —
  // they resolve through their concept's language instead.
  private async resolveLanguageSlug(
    exercise: Exercise,
    userId: string,
  ): Promise<ProgrammingLanguageSlug> {
    if (exercise.lessonId) {
      const lesson = await this.coursesService.getLessonDetail(
        exercise.lessonId,
        userId,
      );
      return lesson.languageSlug;
    }
    if (exercise.conceptId) {
      const concept = await this.conceptRepo.findOne({
        where: { id: exercise.conceptId },
        relations: { language: true },
      });
      if (!concept) {
        throw new NotFoundException('Concept not found');
      }
      return concept.language.slug;
    }
    throw new BadRequestException(
      'Exercise has neither a lesson nor a concept.',
    );
  }

  private async findExerciseOrThrow(exerciseId: string): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }
}
