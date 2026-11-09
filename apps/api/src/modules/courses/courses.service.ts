import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { Language } from './entities/language.entity';
import { LearningPath } from './entities/learning-path.entity';
import { CourseModule as CourseModuleEntity } from './entities/course-module.entity';
import { Lesson } from './entities/lesson.entity';
import { UserProgress } from './entities/user-progress.entity';
import { GamificationService } from '../gamification/gamification.service';
import type {
  LessonDetail,
  LessonSummary,
  ModuleSummary,
  PathOverview,
} from './courses.types';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
    @InjectRepository(LearningPath)
    private readonly pathRepo: Repository<LearningPath>,
    @InjectRepository(CourseModuleEntity)
    private readonly moduleRepo: Repository<CourseModuleEntity>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(UserProgress)
    private readonly progressRepo: Repository<UserProgress>,
    private readonly gamificationService: GamificationService,
  ) {}

  // Only a "beginner" path exists per language so far (Fase 3); intermediate/
  // advanced levels are out of scope until a later phase.
  async getPathOverview(
    languageSlug: ProgrammingLanguageSlug,
    userId: string,
  ): Promise<PathOverview> {
    const language = await this.languageRepo.findOne({
      where: { slug: languageSlug },
    });
    if (!language) {
      throw new NotFoundException(`Unknown language: ${languageSlug}`);
    }

    const path = await this.pathRepo.findOne({
      where: { languageId: language.id, level: 'beginner' },
    });
    if (!path) {
      throw new NotFoundException(
        `No learning path seeded for ${languageSlug}`,
      );
    }

    const modules = await this.moduleRepo.find({
      where: { pathId: path.id },
      order: { order: 'ASC' },
    });

    const lessons = modules.length
      ? await this.lessonRepo.find({
          where: { moduleId: In(modules.map((module) => module.id)) },
          order: { order: 'ASC' },
        })
      : [];

    const completedIds = new Set(
      lessons.length
        ? (
            await this.progressRepo.find({
              where: {
                userId,
                lessonId: In(lessons.map((lesson) => lesson.id)),
              },
            })
          ).map((progress) => progress.lessonId)
        : [],
    );

    const lessonsByModule = new Map<string, Lesson[]>();
    for (const lesson of lessons) {
      const list = lessonsByModule.get(lesson.moduleId) ?? [];
      list.push(lesson);
      lessonsByModule.set(lesson.moduleId, list);
    }

    // Lessons unlock sequentially across the whole path: the first lesson of
    // the first module is always available, and each next one unlocks once
    // the previous is completed. No per-lesson "locked" state is stored —
    // it's derived here every time instead.
    let previousCompleted = true;
    const moduleSummaries: ModuleSummary[] = modules.map((courseModule) => {
      const moduleLessons = lessonsByModule.get(courseModule.id) ?? [];
      const lessonSummaries: LessonSummary[] = moduleLessons.map((lesson) => {
        const completed = completedIds.has(lesson.id);
        const status = completed
          ? 'completed'
          : previousCompleted
            ? 'available'
            : 'locked';
        previousCompleted = completed;
        return {
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          status,
        };
      });

      const moduleStatus =
        lessonSummaries.length === 0
          ? 'locked'
          : lessonSummaries.every((lesson) => lesson.status === 'completed')
            ? 'completed'
            : lessonSummaries.some((lesson) => lesson.status !== 'locked')
              ? 'available'
              : 'locked';

      return {
        id: courseModule.id,
        title: courseModule.title,
        order: courseModule.order,
        status: moduleStatus,
        lessons: lessonSummaries,
      };
    });

    return {
      id: path.id,
      title: path.title,
      description: path.description,
      level: path.level,
      languageSlug: language.slug,
      modules: moduleSummaries,
    };
  }

  async getLessonDetail(
    lessonId: string,
    userId: string,
  ): Promise<LessonDetail> {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: { module: { path: { language: true } } },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const overview = await this.getPathOverview(
      lesson.module.path.language.slug,
      userId,
    );
    const summary = overview.modules
      .flatMap((courseModule) => courseModule.lessons)
      .find((candidate) => candidate.id === lessonId);
    if (!summary) {
      throw new NotFoundException('Lesson not found');
    }
    if (summary.status === 'locked') {
      throw new ForbiddenException('This lesson is locked');
    }

    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      moduleTitle: lesson.module.title,
      title: lesson.title,
      order: lesson.order,
      status: summary.status,
      contentMarkdown: lesson.contentMarkdown,
      xpReward: lesson.xpReward,
      languageSlug: lesson.module.path.language.slug,
    };
  }

  async completeLesson(
    lessonId: string,
    userId: string,
  ): Promise<LessonDetail> {
    const detail = await this.getLessonDetail(lessonId, userId);
    if (detail.status !== 'completed') {
      await this.progressRepo.save(
        this.progressRepo.create({ userId, lessonId }),
      );
      await this.gamificationService.awardLessonXp(userId, lessonId, detail.xpReward);
    }
    return this.getLessonDetail(lessonId, userId);
  }
}
