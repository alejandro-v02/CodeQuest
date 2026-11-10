import type { Repository } from 'typeorm';
import type { XpEvent } from './entities/xp-event.entity';

// Total XP earned per user inside [from, to) — `to` is optional (open-ended).
// XpEvent.userId is varchar, so the ids are passed as plain strings.
export async function sumXpByUser(
  repo: Repository<XpEvent>,
  userIds: string[],
  from: Date,
  to?: Date,
): Promise<Map<string, number>> {
  if (userIds.length === 0) {
    return new Map();
  }

  const query = repo
    .createQueryBuilder('event')
    .select('event.userId', 'userId')
    .addSelect('SUM(event.amount)', 'xp')
    .where('event.createdAt >= :from', { from })
    .andWhere('event.userId IN (:...userIds)', { userIds });
  if (to) {
    query.andWhere('event.createdAt < :to', { to });
  }

  const rows = await query
    .groupBy('event.userId')
    .getRawMany<{ userId: string; xp: string }>();
  return new Map(rows.map((row) => [row.userId, Number(row.xp)]));
}
