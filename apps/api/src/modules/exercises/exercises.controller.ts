import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { PublicUser } from '../users/users.mapper';
import { ExercisesService } from './exercises.service';
import { RunCodeDto } from './dto/run-code.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import type {
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
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('lesson/:lessonId')
  getForLesson(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<ExerciseSummary[]> {
    return this.exercisesService.getExercisesForLesson(lessonId, user.id);
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
}
