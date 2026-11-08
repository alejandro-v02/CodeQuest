import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { Concept } from '../concepts/entities/concept.entity';
import { PistonService } from '../execution/piston.service';
import { Exercise } from '../exercises/entities/exercise.entity';
import { TestCase } from '../exercises/entities/test-case.entity';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { AiService } from './ai.service';
import {
  GeneratedExerciseDto,
  GeneratedTestCaseDto,
} from './dto/generated-exercise.dto';
import { CODE_EXERCISE_PROMPT_V1 } from './prompts/code-exercise.prompt';
import type {
  GenerateCodeExerciseResult,
  GenerationOutcome,
} from './generation.types';
import {
  EXERCISE_GENERATION_QUEUE,
  type ExerciseGenerationJobData,
} from './queue/exercise-generation.queue';

// How many exercises a single backfill job tries to add to the bank.
const BACKFILL_BATCH_SIZE = 3;

// Cosine similarity (1 - cosine distance) above this counts as "close enough
// to be a duplicate" for two exercise prompts on the same concept. Picked
// conservatively — false negatives (letting a near-duplicate through) are
// cheaper than false positives (silently dropping a genuinely different
// exercise), since this only gates automatic approval, not deletion.
const DUPLICATE_SIMILARITY_THRESHOLD = 0.92;

// Output is compared trimmed, matching ExercisesService.runAgainst exactly —
// verification has to use the same comparison a real submission would.
function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, '\n').trim();
}

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);

  constructor(
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(TestCase)
    private readonly testCaseRepo: Repository<TestCase>,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectQueue(EXERCISE_GENERATION_QUEUE)
    private readonly generationQueue: Queue<ExerciseGenerationJobData>,
    private readonly aiService: AiService,
    private readonly pistonService: PistonService,
  ) {}

  // Fire-and-forget: enqueues a batch backfill job for this concept/
  // difficulty, deduped by jobId so a burst of "next exercise" requests
  // hitting a low watermark at the same time only enqueues one job.
  async enqueueBackfill(conceptId: string, difficulty: number): Promise<void> {
    await this.generationQueue.add(
      'backfill',
      { conceptId, difficulty, count: BACKFILL_BATCH_SIZE },
      {
        // BullMQ rejects ':' in custom job ids.
        jobId: `${conceptId}-${difficulty}`,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async generateCodeExercise(
    conceptId: string,
    difficulty: number,
  ): Promise<GenerateCodeExerciseResult> {
    const concept = await this.conceptRepo.findOne({
      where: { id: conceptId },
      relations: { language: true },
    });
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }
    const languageSlug = concept.language.slug;

    const prompt = CODE_EXERCISE_PROMPT_V1;
    const raw = await this.aiService.generateJson(
      prompt.system,
      prompt.buildUserPrompt({
        languageSlug,
        conceptName: concept.name,
        difficulty,
      }),
    );

    const dto = plainToInstance(GeneratedExerciseDto, raw);
    const shapeErrors = await validate(dto);
    if (shapeErrors.length > 0) {
      this.logger.warn(
        `Generated exercise for concept "${concept.slug}" failed shape validation: ` +
          shapeErrors
            .map((error) => Object.values(error.constraints ?? {}).join(', '))
            .join('; '),
      );
      return { outcome: 'invalid_shape' };
    }

    // Execution-based verification: the reference solution has to pass
    // every case, and the starter code must NOT already pass all of them —
    // otherwise there's nothing left for the student to do.
    const referencePassed = await this.runsCleanly(
      languageSlug,
      dto.referenceSolution,
      dto.testCases,
    );
    if (!referencePassed) {
      return this.persistRejected(
        concept,
        difficulty,
        dto,
        'reference_solution_failed',
      );
    }

    const starterAlreadyPasses = await this.runsCleanly(
      languageSlug,
      dto.starterCode,
      dto.testCases,
    );
    if (starterAlreadyPasses) {
      return this.persistRejected(
        concept,
        difficulty,
        dto,
        'starter_code_already_passes',
      );
    }

    // Duplicate detection against already-approved exercises for the same
    // concept. A failed embedding call degrades to "skip dedup" rather than
    // failing the whole generation — a passing, verified exercise is still
    // worth keeping even if we couldn't check it for duplicates.
    let embedding: number[] | null = null;
    try {
      embedding = await this.aiService.embed(dto.prompt);
    } catch (error) {
      this.logger.warn(
        `Embedding failed for concept "${concept.slug}", skipping dedup check: ` +
          (error instanceof Error ? error.message : String(error)),
      );
    }

    if (embedding && (await this.hasSimilarApproved(concept.id, embedding))) {
      return this.persistRejected(concept, difficulty, dto, 'duplicate');
    }

    const exercise = await this.persist(concept, difficulty, dto, 'approved');
    if (embedding) {
      await this.saveEmbedding(exercise.id, embedding);
    }
    return { outcome: 'approved', exerciseId: exercise.id };
  }

  private async runsCleanly(
    languageSlug: ProgrammingLanguageSlug,
    code: string,
    testCases: GeneratedTestCaseDto[],
  ): Promise<boolean> {
    for (const testCase of testCases) {
      const result = await this.pistonService.run(
        languageSlug,
        code,
        testCase.input,
      );
      const passed =
        result.exitCode === 0 &&
        normalizeOutput(result.stdout) ===
          normalizeOutput(testCase.expectedOutput);
      if (!passed) {
        return false;
      }
    }
    return true;
  }

  private async hasSimilarApproved(
    conceptId: string,
    embedding: number[],
  ): Promise<boolean> {
    const literal = `[${embedding.join(',')}]`;
    const rows: Array<{ similarity: string }> = await this.dataSource.query(
      `SELECT 1 - (embedding <=> $1::vector) AS similarity
       FROM exercises
       WHERE concept_id = $2 AND status = 'approved' AND embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT 1`,
      [literal, conceptId],
    );
    const best = rows[0];
    return (
      best !== undefined &&
      Number(best.similarity) >= DUPLICATE_SIMILARITY_THRESHOLD
    );
  }

  private async saveEmbedding(
    exerciseId: string,
    embedding: number[],
  ): Promise<void> {
    const literal = `[${embedding.join(',')}]`;
    await this.dataSource.query(
      'UPDATE exercises SET embedding = $1::vector WHERE id = $2',
      [literal, exerciseId],
    );
  }

  private async persistRejected(
    concept: Concept,
    difficulty: number,
    dto: GeneratedExerciseDto,
    outcome: Exclude<GenerationOutcome, 'approved' | 'invalid_shape'>,
  ): Promise<GenerateCodeExerciseResult> {
    this.logger.warn(
      `Rejected generated exercise for concept "${concept.slug}": ${outcome}`,
    );
    const exercise = await this.persist(concept, difficulty, dto, 'rejected');
    return { outcome, exerciseId: exercise.id };
  }

  private async persist(
    concept: Concept,
    difficulty: number,
    dto: GeneratedExerciseDto,
    status: 'approved' | 'rejected',
  ): Promise<Exercise> {
    const exercise = await this.exerciseRepo.save(
      this.exerciseRepo.create({
        lessonId: null,
        conceptId: concept.id,
        order: 0,
        type: 'code',
        prompt: dto.prompt,
        starterCode: dto.starterCode,
        payload: null,
        difficulty,
        isAiGenerated: true,
        status,
      }),
    );

    await this.testCaseRepo.save(
      dto.testCases.map((testCase, index) =>
        this.testCaseRepo.create({
          exerciseId: exercise.id,
          order: index,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          isHidden: testCase.isHidden,
        }),
      ),
    );

    return exercise;
  }
}
