import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { PublicUser } from '../users/users.mapper';
import { AnalyticsSummaryService } from './analytics-summary.service';
import { AnalyticsService } from './analytics.service';
import type { AnalyticsSummaryDto } from './analytics.types';
import { TrackEventsDto } from './dto/track-events.dto';

// Tracking is high-frequency but cheap; still capped per client so a buggy
// app can't flood the table.
const TRACK_THROTTLE = { default: { limit: 30, ttl: 60_000 } };

@UseGuards(JwtAccessGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly summaryService: AnalyticsSummaryService,
  ) {}

  @Throttle(TRACK_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('events')
  async track(
    @CurrentUser() user: PublicUser,
    @Body() dto: TrackEventsDto,
  ): Promise<void> {
    await this.analyticsService.recordBatch(user.id, dto.events);
  }

  @UseGuards(AdminGuard)
  @Get('summary')
  getSummary(): Promise<AnalyticsSummaryDto> {
    return this.summaryService.getSummary();
  }
}
