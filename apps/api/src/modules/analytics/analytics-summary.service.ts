import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ActivityWindowsDto,
  AnalyticsSummaryDto,
  RetentionDto,
} from './analytics.types';
import { AnalyticsEvent } from './entities/analytics-event.entity';

const RETENTION_DAYS = [1, 7, 30];
const WEEKS_SHOWN = 4;
const DAY_MS = 24 * 60 * 60 * 1000;

type Row = Record<string, string | number | null>;

// Read-only product metrics computed straight from the tables that already
// exist (users, xp_events, ai_interactions) plus the analytics_events log.
@Injectable()
export class AnalyticsSummaryService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
  ) {}

  async getSummary(): Promise<AnalyticsSummaryDto> {
    const [users, funnel, learners, appOpens, retention, lessonsByWeek, ai] =
      await Promise.all([
        this.users(),
        this.funnel(),
        this.activity('xp_events', 'user_id', 'created_at', ''),
        this.activity(
          'analytics_events',
          '"userId"',
          '"createdAt"',
          "and name = 'app_open'",
        ),
        Promise.all(RETENTION_DAYS.map((day) => this.retention(day))),
        this.lessonsByWeek(),
        this.ai(),
      ]);

    return {
      generatedAt: new Date().toISOString(),
      users,
      funnel,
      learners,
      appOpens,
      retention,
      lessonsCompletedByWeek: lessonsByWeek,
      ai,
    };
  }

  private async query(sql: string, params: unknown[] = []): Promise<Row[]> {
    return this.eventRepo.manager.query<Row[]>(sql, params);
  }

  private async users(): Promise<AnalyticsSummaryDto['users']> {
    const [row] = await this.query(`
      select count(*)::int as total,
             count(*) filter (where "createdAt" >= now() - interval '7 days')::int as new7
      from users`);
    return { total: Number(row.total), newLast7Days: Number(row.new7) };
  }

  private async funnel(): Promise<AnalyticsSummaryDto['funnel']> {
    const [row] = await this.query(`
      select
        (select count(*)::int from users) as registered,
        (select count(*)::int from users where "preferredLanguage" is not null) as onboarded,
        (select count(distinct user_id)::int from xp_events where reason = 'exercise') as first_exercise`);
    return {
      registered: Number(row.registered),
      onboarded: Number(row.onboarded),
      firstExercise: Number(row.first_exercise),
    };
  }

  // `table`, `userColumn`, `dateColumn` and `extraWhere` are fixed strings
  // from this file, never user input.
  private async activity(
    table: string,
    userColumn: string,
    dateColumn: string,
    extraWhere: string,
  ): Promise<ActivityWindowsDto> {
    const [row] = await this.query(`
      select
        count(distinct ${userColumn}) filter (where ${dateColumn} >= now() - interval '24 hours')::int as d1,
        count(distinct ${userColumn}) filter (where ${dateColumn} >= now() - interval '7 days')::int as d7,
        count(distinct ${userColumn}) filter (where ${dateColumn} >= now() - interval '30 days')::int as d30
      from ${table}
      where ${userColumn} is not null
        and ${dateColumn} >= now() - interval '30 days' ${extraWhere}`);
    return {
      last24h: Number(row.d1),
      last7d: Number(row.d7),
      last30d: Number(row.d30),
    };
  }

  // Classic "day N" retention: of the users whose day N is already over, how
  // many earned XP exactly N calendar days after signing up.
  private async retention(day: number): Promise<RetentionDto> {
    const [row] = await this.query(
      `
      select count(*)::int as eligible,
             count(*) filter (where exists (
               select 1 from xp_events e
               where e.user_id = u.id::text
                 and e.created_at::date = u."createdAt"::date + $1::int
             ))::int as returned
      from users u
      where u."createdAt"::date + $1::int < current_date`,
      [day],
    );
    const eligible = Number(row.eligible);
    const returned = Number(row.returned);
    return {
      day,
      eligible,
      returned,
      rate:
        eligible === 0 ? null : Math.round((returned / eligible) * 1000) / 10,
    };
  }

  private async lessonsByWeek(): Promise<
    AnalyticsSummaryDto['lessonsCompletedByWeek']
  > {
    const rows = await this.query(`
      select to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as week,
             count(*)::int as count
      from xp_events
      where reason = 'lesson'
        and created_at >= date_trunc('week', now()) - interval '${(WEEKS_SHOWN - 1) * 7} days'
      group by 1`);
    const countByWeek = new Map(
      rows.map((r) => [String(r.week), Number(r.count)]),
    );

    // Fill empty weeks so the chart always has WEEKS_SHOWN entries.
    const [{ monday }] = await this.query(
      `select to_char(date_trunc('week', now()), 'YYYY-MM-DD') as monday`,
    );
    const thisMonday = new Date(`${String(monday)}T00:00:00Z`);
    return Array.from({ length: WEEKS_SHOWN }, (_, index) => {
      const start = new Date(
        thisMonday.getTime() - (WEEKS_SHOWN - 1 - index) * 7 * DAY_MS,
      )
        .toISOString()
        .slice(0, 10);
      return { weekStart: start, count: countByWeek.get(start) ?? 0 };
    });
  }

  private async ai(): Promise<AnalyticsSummaryDto['ai']> {
    const [row] = await this.query(`
      select
        (select count(distinct user_id)::int from ai_interactions
           where user_id is not null and created_at >= now() - interval '7 days') as users7,
        (select count(*)::int from analytics_events
           where name = 'ai_limit_hit' and "createdAt" >= now() - interval '7 days') as hits7,
        (select count(distinct "userId")::int from analytics_events
           where name = 'ai_limit_hit' and "createdAt" >= now() - interval '7 days') as hit_users7`);
    return {
      usersLast7Days: Number(row.users7),
      limitHitsLast7Days: Number(row.hits7),
      usersHitLimitLast7Days: Number(row.hit_users7),
    };
  }
}
