import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { ConceptsModule } from '../concepts/concepts.module';
import { ExecutionModule } from '../execution/execution.module';
import { Exercise } from '../exercises/entities/exercise.entity';
import { TestCase } from '../exercises/entities/test-case.entity';
import { GenerationService } from './generation.service';
import { ExerciseGenerationProcessor } from './queue/exercise-generation.processor';
import { EXERCISE_GENERATION_QUEUE } from './queue/exercise-generation.queue';
import { TemplateGeneratorService } from './templates/template-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, TestCase]),
    BullModule.registerQueue({ name: EXERCISE_GENERATION_QUEUE }),
    ConceptsModule,
    ExecutionModule,
    AiModule,
  ],
  providers: [
    GenerationService,
    TemplateGeneratorService,
    ExerciseGenerationProcessor,
  ],
  exports: [GenerationService, TemplateGeneratorService],
})
export class GenerationModule {}
