import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';
import { CoursesService } from '../courses/courses.service';
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
import type { SubmitAnswerDto } from './dto/submit-answer.dto';
import type {
  AnswerSubmitResult,
  ExerciseDetail,
  ExercisePayloadView,
  ExerciseSummary,
  RunResult,
  SubmitResult,
  TestCaseResult,
} from './exercises.types';

// Expected output is compared trimmed, since a trailing newline from
// print()/console.log() shouldn't make an otherwise-correct answer fail.
function normalize(output: string): string {
  return output.replace(/\r\n/g, '\n').trim();
}

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(TestCase)
    private readonly testCaseRepo: Repository<TestCase>,
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
    private readonly coursesService: CoursesService,
    private readonly pistonService: PistonService,
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
