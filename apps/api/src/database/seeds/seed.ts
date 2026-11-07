import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';

// Run after `nest build` (see package.json "seed" script), so __dirname
// points at dist/database/seeds — same depth under the repo root as
// src/database/seeds, hence the same number of ".." segments either way.
config({ path: resolve(__dirname, '../../../../../.env') });

import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Language } from '../../modules/courses/entities/language.entity';
import { LearningPath } from '../../modules/courses/entities/learning-path.entity';
import { CourseModule } from '../../modules/courses/entities/course-module.entity';
import { Lesson } from '../../modules/courses/entities/lesson.entity';
import { UserProgress } from '../../modules/courses/entities/user-progress.entity';
import { Exercise } from '../../modules/exercises/entities/exercise.entity';
import { TestCase } from '../../modules/exercises/entities/test-case.entity';
import { Attempt } from '../../modules/exercises/entities/attempt.entity';
import { curriculum } from './curriculum.data';

// Standalone script (not booted through Nest), so it opens its own
// DataSource. `synchronize: true` mirrors the app's dev config (see
// app.module.ts) so this also works against a fresh database.
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'codequest',
  password: process.env.DB_PASSWORD ?? 'codequest',
  database: process.env.DB_NAME ?? 'codequest',
  entities: [
    User,
    Language,
    LearningPath,
    CourseModule,
    Lesson,
    UserProgress,
    Exercise,
    TestCase,
    Attempt,
  ],
  synchronize: true,
});

async function run(): Promise<void> {
  await dataSource.initialize();

  const languageRepo = dataSource.getRepository(Language);
  const pathRepo = dataSource.getRepository(LearningPath);
  const moduleRepo = dataSource.getRepository(CourseModule);
  const lessonRepo = dataSource.getRepository(Lesson);
  const exerciseRepo = dataSource.getRepository(Exercise);
  const testCaseRepo = dataSource.getRepository(TestCase);

  for (const languageSeed of curriculum) {
    let language = await languageRepo.findOne({
      where: { slug: languageSeed.slug },
    });
    language ??= await languageRepo.save(
      languageRepo.create({
        slug: languageSeed.slug,
        name: languageSeed.name,
      }),
    );

    let path = await pathRepo.findOne({
      where: { languageId: language.id, level: 'beginner' },
    });
    if (!path) {
      path = pathRepo.create({ languageId: language.id, level: 'beginner' });
    }
    path.title = languageSeed.pathTitle;
    path.description = languageSeed.pathDescription;
    path = await pathRepo.save(path);

    for (const [moduleIndex, moduleSeed] of languageSeed.modules.entries()) {
      let courseModule = await moduleRepo.findOne({
        where: { pathId: path.id, order: moduleIndex },
      });
      if (!courseModule) {
        courseModule = moduleRepo.create({
          pathId: path.id,
          order: moduleIndex,
        });
      }
      courseModule.title = moduleSeed.title;
      courseModule = await moduleRepo.save(courseModule);

      for (const [lessonIndex, lessonSeed] of moduleSeed.lessons.entries()) {
        let lesson = await lessonRepo.findOne({
          where: { moduleId: courseModule.id, order: lessonIndex },
        });
        if (!lesson) {
          lesson = lessonRepo.create({
            moduleId: courseModule.id,
            order: lessonIndex,
          });
        }
        lesson.title = lessonSeed.title;
        lesson.contentMarkdown = lessonSeed.contentMarkdown;
        lesson.xpReward = lessonSeed.xpReward;
        lesson = await lessonRepo.save(lesson);

        for (const [exerciseIndex, exerciseSeed] of (
          lessonSeed.exercises ?? []
        ).entries()) {
          let exercise = await exerciseRepo.findOne({
            where: { lessonId: lesson.id, order: exerciseIndex },
          });
          if (!exercise) {
            exercise = exerciseRepo.create({
              lessonId: lesson.id,
              order: exerciseIndex,
            });
          }
          exercise.prompt = exerciseSeed.prompt;
          exercise.starterCode = exerciseSeed.starterCode;
          exercise.difficulty = exerciseSeed.difficulty;
          exercise = await exerciseRepo.save(exercise);

          for (const [
            testCaseIndex,
            testCaseSeed,
          ] of exerciseSeed.testCases.entries()) {
            let testCase = await testCaseRepo.findOne({
              where: { exerciseId: exercise.id, order: testCaseIndex },
            });
            testCase ??= testCaseRepo.create({
              exerciseId: exercise.id,
              order: testCaseIndex,
            });
            testCase.input = testCaseSeed.input;
            testCase.expectedOutput = testCaseSeed.expectedOutput;
            testCase.isHidden = testCaseSeed.isHidden;
            await testCaseRepo.save(testCase);
          }
        }
      }
    }

    console.log(`Seeded ${languageSeed.name}`);
  }

  await dataSource.destroy();
  console.log('Curriculum seed complete.');
}

run().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
