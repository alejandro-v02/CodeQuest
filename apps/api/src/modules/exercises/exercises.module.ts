import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from '../courses/courses.module';
import { ExecutionModule } from '../execution/execution.module';
import { Exercise } from './entities/exercise.entity';
import { TestCase } from './entities/test-case.entity';
import { Attempt } from './entities/attempt.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, TestCase, Attempt]),
    CoursesModule,
    ExecutionModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
