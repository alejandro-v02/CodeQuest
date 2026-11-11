import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { AppConfig } from '../../config/configuration';
import { MoreThan, Repository } from 'typeorm';
import { AnalyticsService } from '../analytics/analytics.service';
import {
  AiInteraction,
  type AiInteractionKind,
} from './entities/ai-interaction.entity';

// Per-user daily cap across every AI-backed feature (PLAN.md 5B: "límites
// de uso por usuario/día") — protects the shared AI quota/credit as
// the app grows beyond a single user. Configurable via AI_DAILY_LIMIT.
// Single point that reads/writes AiInteraction — enforces the daily cap and
// keeps the audit trail of every AI-backed request, cached or not.
@Injectable()
export class AiUsageService {
  constructor(
    @InjectRepository(AiInteraction)
    private readonly interactionRepo: Repository<AiInteraction>,
    private readonly analyticsService: AnalyticsService,
    configService: ConfigService<AppConfig, true>,
  ) {
    this.dailyLimit = configService.get('aiDailyLimit', { infer: true });
  }

  private readonly dailyLimit: number;

  async assertUnderDailyLimit(userId: string): Promise<void> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await this.interactionRepo.count({
      where: { userId, cached: false, createdAt: MoreThan(since) },
    });
    if (count >= this.dailyLimit) {
      // How often people hit the cap is the signal for sizing a paid plan.
      await this.analyticsService.record(userId, 'ai_limit_hit');
      throw new HttpException(
        'Alcanzaste el límite diario de usos de IA. Vuelve mañana.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  async record(
    userId: string | null,
    kind: AiInteractionKind,
    cached: boolean,
    exerciseId: string | null = null,
  ): Promise<void> {
    await this.interactionRepo.save(
      this.interactionRepo.create({ userId, kind, cached, exerciseId }),
    );
  }
}
