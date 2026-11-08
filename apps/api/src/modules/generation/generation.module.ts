import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsModule } from '../concepts/concepts.module';
import { ExecutionModule } from '../execution/execution.module';
import { Exercise } from '../exercises/entities/exercise.entity';
import { TestCase } from '../exercises/entities/test-case.entity';
import { AiService } from './ai.service';
import { GenerationService } from './generation.service';
import { TemplateGeneratorService } from './templates/template-generator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, TestCase]),
    ConceptsModule,
    ExecutionModule,
  ],
  providers: [AiService, GenerationService, TemplateGeneratorService],
  exports: [AiService, GenerationService, TemplateGeneratorService],
})
export class GenerationModule {}
