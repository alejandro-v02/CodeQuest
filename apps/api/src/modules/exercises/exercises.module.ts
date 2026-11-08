import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptsModule } from '../concepts/concepts.module';
import { CoursesModule } from '../courses/courses.module';
import { ExecutionModule } from '../execution/execution.module';
import { Exercise } from './entities/exercise.entity';
import { TestCase } from './entities/test-case.entity';
import { Attempt } from './entities/attempt.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import { ExerciseReport } from './entities/exercise-report.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

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
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
