import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { PublicUser } from '../users/users.mapper';
import { GamificationService } from './gamification.service';
import type {
  GamificationSummary,
  RankingResponse,
} from './gamification.types';

@UseGuards(JwtAccessGuard)
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  async getSummary(
    @CurrentUser() user: PublicUser,
  ): Promise<GamificationSummary> {
    return this.gamificationService.getSummary(user.id);
  }

  @Get('ranking')
  async getRanking(@CurrentUser() user: PublicUser): Promise<RankingResponse> {
    return this.gamificationService.getWeeklyRanking(user.id);
  }
}
