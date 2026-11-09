import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsModule } from '../concepts/concepts.module';
import { CoursesModule } from '../courses/courses.module';
import { ExecutionModule } from '../execution/execution.module';
import { GenerationModule } from '../generation/generation.module';
import { Exercise } from './entities/exercise.entity';
import { TestCase } from './entities/test-case.entity';
import { Attempt } from './entities/attempt.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import { ExerciseReport } from './entities/exercise-report.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { NextExerciseService } from './next-exercise.service';
import { ExerciseRecalibrationService } from './exercise-recalibration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      TestCase,
      Attempt,
      UserExerciseHistory,
      ExerciseReport,
    ]),
    ConceptsModule,
    CoursesModule,
    ExecutionModule,
    GenerationModule,
  ],
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    NextExerciseService,
    ExerciseRecalibrationService,
  ],
})
export class ExercisesModule {}
