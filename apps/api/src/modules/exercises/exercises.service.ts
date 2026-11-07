import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CoursesService } from '../courses/courses.service';
import { PistonService } from '../execution/piston.service';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { Exercise } from './entities/exercise.entity';
import { TestCase } from './entities/test-case.entity';
import { Attempt } from './entities/attempt.entity';
import type {
  ExerciseDetail,
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
    const lesson = await this.coursesService.getLessonDetail(
      exercise.lessonId,
      userId,
    );

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId, isHidden: false },
      order: { order: 'ASC' },
    });
    const solvedIds = await this.getSolvedExerciseIds(userId, [exerciseId]);

    return {
      id: exercise.id,
      lessonId: exercise.lessonId,
      languageSlug: lesson.languageSlug,
      order: exercise.order,
      type: exercise.type,
      prompt: exercise.prompt,
      starterCode: exercise.starterCode,
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
    const lesson = await this.coursesService.getLessonDetail(
      exercise.lessonId,
      userId,
    );

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId, isHidden: false },
      order: { order: 'ASC' },
    });

    const results = await this.runAgainst(lesson.languageSlug, code, testCases);

    return {
      allPassed: results.every((result) => result.passed),
      testCases: results,
    };
  }

  // "Enviar": runs every case (visible + hidden) and records the attempt.
  async submitCode(
    exerciseId: string,
    userId: string,
    code: string,
  ): Promise<SubmitResult> {
    const exercise = await this.findExerciseOrThrow(exerciseId);
    const lesson = await this.coursesService.getLessonDetail(
      exercise.lessonId,
      userId,
    );

    const testCases = await this.testCaseRepo.find({
      where: { exerciseId },
      order: { order: 'ASC' },
    });

    const results = await this.runAgainst(lesson.languageSlug, code, testCases);
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
