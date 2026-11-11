import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { AiQuotaExceededError } from '../../ai/ai.service';
import { GenerationService } from '../generation.service';
import {
  EXERCISE_GENERATION_QUEUE,
  type ExerciseGenerationJobData,
} from './exercise-generation.queue';

// Backfills the Fase 5A exercise bank in the background — triggered by
// NextExerciseService's low-watermark check, never awaited by a request.
@Processor(EXERCISE_GENERATION_QUEUE)
export class ExerciseGenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(ExerciseGenerationProcessor.name);

  constructor(private readonly generationService: GenerationService) {
    super();
  }

  async process(job: Job<ExerciseGenerationJobData>): Promise<void> {
    const { conceptId, difficulty, count } = job.data;
    for (let i = 0; i < count; i += 1) {
      try {
        const result = await this.generationService.generateCodeExercise(
          conceptId,
          difficulty,
        );
        this.logger.log(
          `Backfill ${i + 1}/${count} for concept ${conceptId} @ difficulty ${difficulty}: ${result.outcome}`,
        );
      } catch (error) {
        // No quota left: the remaining attempts would fail the same way.
        if (error instanceof AiQuotaExceededError) {
          this.logger.warn(
            `Backfill for concept ${conceptId} stopped: AI quota exceeded.`,
          );
          break;
        }
        // One failed attempt (e.g. a transient AI/Piston error) shouldn't
        // abandon the rest of the batch.
        this.logger.warn(
          `Backfill attempt ${i + 1}/${count} for concept ${conceptId} failed: ` +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    }
  }
}
