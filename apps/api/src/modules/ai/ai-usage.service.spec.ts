import { HttpException, HttpStatus } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import type { AnalyticsService } from '../analytics/analytics.service';
import { AiUsageService } from './ai-usage.service';
import type { AiInteraction } from './entities/ai-interaction.entity';

// @nestjs/config is ESM-only and Jest can't load it here; the service only
// needs a stand-in for the type.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));
// Same for @nestjs/typeorm (only InjectRepository is used, as a decorator).
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));
// And the analytics service, whose imports pull ESM-only packages.
jest.mock('../analytics/analytics.service', () => ({
  AnalyticsService: class {},
}));

function build(dailyLimit: number, usedToday: number) {
  const count = jest.fn().mockResolvedValue(usedToday);
  const record = jest.fn().mockResolvedValue(undefined);
  const service = new AiUsageService(
    { count } as unknown as Repository<AiInteraction>,
    { record } as unknown as AnalyticsService,
    { get: () => dailyLimit } as unknown as ConfigService<never, true>,
  );
  return { service, count, record };
}

describe('AiUsageService.assertUnderDailyLimit', () => {
  it('lets the user through while they are under the configured limit', async () => {
    const { service, record } = build(10, 9);

    await expect(
      service.assertUnderDailyLimit('user-1'),
    ).resolves.toBeUndefined();
    expect(record).not.toHaveBeenCalled();
  });

  it('refuses with 429 once the limit is reached and records the event', async () => {
    const { service, record } = build(10, 10);

    const attempt = service.assertUnderDailyLimit('user-1');

    await expect(attempt).rejects.toBeInstanceOf(HttpException);
    await expect(attempt).rejects.toMatchObject({
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
    expect(record).toHaveBeenCalledWith('user-1', 'ai_limit_hit');
  });

  it('uses the configured limit, not a fixed one', async () => {
    const { service } = build(3, 3);

    await expect(service.assertUnderDailyLimit('user-1')).rejects.toMatchObject(
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
      },
    );
  });

  it('only counts requests that actually reached the AI (not cached ones)', async () => {
    const { service, count } = build(10, 0);

    await service.assertUnderDailyLimit('user-1');

    const [query] = count.mock.calls[0] as [
      { where: { userId: string; cached: boolean } },
    ];
    expect(query.where.userId).toBe('user-1');
    expect(query.where.cached).toBe(false);
  });
});
