import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { LearningPath } from './entities/learning-path.entity';
import { CourseModule as CourseModuleEntity } from './entities/course-module.entity';
import { Lesson } from './entities/lesson.entity';
import { UserProgress } from './entities/user-progress.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      LearningPath,
      CourseModuleEntity,
      Lesson,
      UserProgress,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
