import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Throttle } from '@nestjs/throttler';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Exercise } from '../exercises/entities/exercise.entity';
import { User, type ProgrammingLanguageSlug } from '../users/entities/user.entity';
import type { PublicUser } from '../users/users.mapper';
import { AiUsageService } from './ai-usage.service';
import { AiService } from './ai.service';
import { ExplainErrorDto } from './dto/explain-error.dto';
import { GeneratedExplanationDto } from './dto/generated-explanation.dto';
import { GeneratedHintDto } from './dto/generated-hint.dto';
import { GeneratedPlacementQuestionsDto } from './dto/generated-placement-question.dto';
import { GetHintDto } from './dto/get-hint.dto';
import { SubmitPlacementDto } from './dto/submit-placement.dto';
import { ExerciseHint } from './entities/exercise-hint.entity';
import { PlacementQuiz } from './entities/placement-quiz.entity';
import { EXPLAIN_ERROR_PROMPT_V1 } from './prompts/explain-error.prompt';
import { HINT_PROMPT_V1 } from './prompts/hint.prompt';
import { PLACEMENT_QUESTION_PROMPT_V1 } from './prompts/placement-question.prompt';

// AI calls are slower/costlier than a normal request, so a tighter burst
// throttle than the app-wide default — mirrors EXECUTION_THROTTLE in
// exercises.controller.ts.
const AI_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

// 0-1 correct -> difficulty 1, up to 4 correct -> difficulty 4.
// NextExerciseService's streak logic still caps at 5 regardless — the
// placement test itself never assigns the max level on day one.
function difficultyFromScore(correct: number): number {
  return Math.max(1, Math.min(4, correct));
}

@UseGuards(JwtAccessGuard)
@Controller('ai')
export class AiController {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(ExerciseHint)
    private readonly hintRepo: Repository<ExerciseHint>,
    @InjectRepository(PlacementQuiz)
    private readonly placementRepo: Repository<PlacementQuiz>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly aiService: AiService,
    private readonly aiUsageService: AiUsageService,
  ) {}

  @Throttle(AI_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('exercises/:exerciseId/hint')
  async getHint(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: GetHintDto,
    @CurrentUser() user: PublicUser,
  ): Promise<{ level: number; text: string }> {
    const cached = await this.hintRepo.findOne({
      where: { exerciseId, level: dto.level },
    });
    if (cached) {
      await this.aiUsageService.record(user.id, 'hint', true, exerciseId);
      return { level: cached.level, text: cached.text };
    }

    await this.aiUsageService.assertUnderDailyLimit(user.id);

    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const raw = await this.aiService.generateJson(
      HINT_PROMPT_V1.system,
      HINT_PROMPT_V1.buildUserPrompt({
        languageSlug: dto.languageSlug,
        exercisePrompt: exercise.prompt,
        difficulty: exercise.difficulty,
        level: dto.level,
      }),
    );
    const parsed = plainToInstance(GeneratedHintDto, raw);
    const errors = await validate(parsed);
    if (errors.length > 0) {
      throw new ServiceUnavailableException('La IA no devolvió una pista válida.');
    }

    const hint = await this.hintRepo.save(
      this.hintRepo.create({
        exerciseId,
        level: dto.level,
        text: parsed.text,
      }),
    );
    await this.aiUsageService.record(user.id, 'hint', false, exerciseId);
    return { level: hint.level, text: hint.text };
  }

  @Throttle(AI_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('exercises/:exerciseId/explain-error')
  async explainError(
    @Param('exerciseId') exerciseId: string,
    @Body() dto: ExplainErrorDto,
    @CurrentUser() user: PublicUser,
  ): Promise<{ explanation: string }> {
    await this.aiUsageService.assertUnderDailyLimit(user.id);

    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const raw = await this.aiService.generateJson(
      EXPLAIN_ERROR_PROMPT_V1.system,
      EXPLAIN_ERROR_PROMPT_V1.buildUserPrompt({
        languageSlug: dto.languageSlug,
        exercisePrompt: exercise.prompt,
        code: dto.code,
        errorMessage: dto.errorMessage,
      }),
    );
    const parsed = plainToInstance(GeneratedExplanationDto, raw);
    const errors = await validate(parsed);
    if (errors.length > 0) {
      throw new ServiceUnavailableException(
        'La IA no devolvió una explicación válida.',
      );
    }

    await this.aiUsageService.record(user.id, 'explain_error', false);
    return { explanation: parsed.explanation };
  }

  @Throttle(AI_THROTTLE)
  @Get('placement/questions')
  async getPlacementQuestions(
    @Query('languageSlug') languageSlug: ProgrammingLanguageSlug,
    @CurrentUser() user: PublicUser,
  ): Promise<{ prompt: string; options: string[] }[]> {
    const cached = await this.placementRepo.findOne({
      where: { languageSlug },
    });
    if (cached) {
      await this.aiUsageService.record(user.id, 'placement', true);
      return cached.questions.map(({ prompt, options }) => ({ prompt, options }));
    }

    const raw = await this.aiService.generateJson(
      PLACEMENT_QUESTION_PROMPT_V1.system,
      PLACEMENT_QUESTION_PROMPT_V1.buildUserPrompt({ languageSlug }),
    );
    const parsed = plainToInstance(GeneratedPlacementQuestionsDto, raw);
    const errors = await validate(parsed);
    if (errors.length > 0) {
      throw new ServiceUnavailableException(
        'La IA no devolvió preguntas válidas.',
      );
    }

    const quiz = await this.placementRepo.save(
      this.placementRepo.create({
        languageSlug,
        questions: parsed.questions,
      }),
    );
    // System-level generation shared by everyone who takes this language's
    // test afterwards — doesn't count against the triggering user's limit.
    await this.aiUsageService.record(null, 'placement', false);
    return quiz.questions.map(({ prompt, options }) => ({ prompt, options }));
  }

  @HttpCode(HttpStatus.OK)
  @Post('placement/submit')
  async submitPlacement(
    @Body() dto: SubmitPlacementDto,
    @CurrentUser() user: PublicUser,
  ): Promise<{ assignedDifficulty: number }> {
    const quiz = await this.placementRepo.findOne({
      where: { languageSlug: dto.languageSlug },
    });
    if (!quiz) {
      throw new NotFoundException(
        'No hay prueba de nivel generada para este lenguaje todavía.',
      );
    }

    let correct = 0;
    for (const answer of dto.answers) {
      const question = quiz.questions[answer.questionIndex];
      if (question && answer.selectedIndex === question.correctIndex) {
        correct += 1;
      }
    }

    const assignedDifficulty = difficultyFromScore(correct);
    await this.userRepo.update(user.id, { placementDifficulty: assignedDifficulty });
    await this.aiUsageService.record(user.id, 'placement', true);
    return { assignedDifficulty };
  }
}
