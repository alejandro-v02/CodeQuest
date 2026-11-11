import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sanitizeProps } from './analytics.rules';
import type { TrackEventDto } from './dto/track-events.dto';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
  ) {}

  // Never throws: analytics must not be able to break the feature that
  // triggered it, so failures are only logged.
  async record(
    userId: string | null,
    name: string,
    props?: unknown,
  ): Promise<void> {
    try {
      await this.eventRepo.save(
        this.eventRepo.create({ userId, name, props: sanitizeProps(props) }),
      );
    } catch (error) {
      this.logger.warn(`Could not record "${name}": ${String(error)}`);
    }
  }

  async recordBatch(userId: string, events: TrackEventDto[]): Promise<void> {
    try {
      await this.eventRepo.save(
        events.map((event) =>
          this.eventRepo.create({
            userId,
            name: event.name,
            props: sanitizeProps(event.props),
          }),
        ),
      );
    } catch (error) {
      this.logger.warn(`Could not record a batch: ${String(error)}`);
    }
  }
}
