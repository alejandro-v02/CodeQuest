import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { PublicUser } from '../users/users.mapper';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { CoursesService } from './courses.service';
import type { LessonDetail, PathOverview } from './courses.types';

@UseGuards(JwtAccessGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':languageSlug/path')
  getPath(
    @Param('languageSlug') languageSlug: ProgrammingLanguageSlug,
    @CurrentUser() user: PublicUser,
  ): Promise<PathOverview> {
    return this.coursesService.getPathOverview(languageSlug, user.id);
  }

  @Get('lessons/:lessonId')
  getLesson(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<LessonDetail> {
    return this.coursesService.getLessonDetail(lessonId, user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('lessons/:lessonId/complete')
  completeLesson(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<LessonDetail> {
    return this.coursesService.completeLesson(lessonId, user.id);
  }
}
