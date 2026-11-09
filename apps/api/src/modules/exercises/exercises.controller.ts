import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { PublicUser } from '../users/users.mapper';
import { ExercisesService } from './exercises.service';
import { NextExerciseService } from './next-exercise.service';
import { RunCodeDto } from './dto/run-code.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { ReportExerciseDto } from './dto/report-exercise.dto';
import type {
  AdminExerciseStat,
  AnswerSubmitResult,
  ExerciseDetail,
  ExerciseSummary,
  RunResult,
  SubmitResult,
} from './exercises.types';

// Running arbitrary user code hits an external sandbox per request, so it
// gets its own tight throttle (PLAN.md section 6: "rate limiting en
// endpoints de ... ejecución").
const EXECUTION_THROTTLE = { default: { limit: 15, ttl: 60_000 } };

@UseGuards(JwtAccessGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly nextExerciseService: NextExerciseService,
  ) {}

  @Get('lesson/:lessonId')
  getForLesson(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<ExerciseSummary[]> {
    return this.exercisesService.getExercisesForLesson(lessonId, user.id);
  }

  // Fase 5A.3 "siguiente ejercicio" — must be declared before ':exerciseId'
  // so Nest's route matching doesn't treat "next" as an exercise id.
  @Get('next')
  getNext(
    @Query('conceptId') conceptId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<ExerciseDetail> {
    return this.nextExerciseService.getNext(user.id, conceptId);
  }

  // Fase 5A.4 admin panel — must be declared before ':exerciseId' so Nest's
  // route matching doesn't treat "admin" as an exercise id.
  @Get('admin/stats')
  getAdminStats(): Promise<AdminExerciseStat[]> {
    return this.exercisesService.getAdminStats();
  }

  @Get(':exerciseId')
  getOne(
    @Param('exerciseId') exerciseId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<ExerciseDetail> {
    return this.exercisesService.getExercise(exerciseId, user.id);
  }

  @Throttle(EXECUTION_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post(':exerciseId/run')
  run(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: RunCodeDto,
    @CurrentUser() user: PublicUser,
  ): Promise<RunResult> {
    return this.exercisesService.runCode(exerciseId, user.id, dto.code);
  }

  @Throttle(EXECUTION_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post(':exerciseId/submit')
  submit(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: SubmitAnswerDto,
    @CurrentUser() user: PublicUser,
  ): Promise<SubmitResult | AnswerSubmitResult> {
    return this.exercisesService.submitAnswer(exerciseId, user.id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':exerciseId/report')
  report(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: ReportExerciseDto,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    return this.exercisesService.reportExercise(
      user.id,
      exerciseId,
      dto.reason,
      dto.details,
    );
  }
}
