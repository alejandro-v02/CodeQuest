import type { LeagueResult, LeagueZone } from './leagues.types';

export const LEAGUE_GROUP_SIZE = 30;
// Bronze (0) ... top tier (MAX_TIER); tier names live in the mobile i18n.
export const MAX_TIER = 4;
const MAX_ZONE_SIZE = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Places at each end of a bracket that promote / demote: 5 in a full
// bracket, a third of a small one, and none below 3 people (so a bracket of
// 1-2 doesn't promote or demote everybody).
export function zoneSize(bracketSize: number): number {
  return Math.min(MAX_ZONE_SIZE, Math.floor(bracketSize / 3));
}

// Promotion needs actual XP (sitting at the top with 0 XP earns nothing) and
// is impossible at the top tier; demotion is impossible at the bottom tier.
export function zoneFor(
  rank: number,
  bracketSize: number,
  tier: number,
  weeklyXp: number,
): LeagueZone {
  const size = zoneSize(bracketSize);
  if (size === 0) {
    return 'safe';
  }
  if (rank <= size && weeklyXp > 0 && tier < MAX_TIER) {
    return 'promote';
  }
  if (rank > bracketSize - size && tier > 0) {
    return 'demote';
  }
  return 'safe';
}

export function resultFor(zone: LeagueZone): LeagueResult {
  if (zone === 'promote') {
    return 'promoted';
  }
  return zone === 'demote' ? 'demoted' : 'stayed';
}

export function nextTier(tier: number, result: LeagueResult): number {
  if (result === 'promoted') {
    return Math.min(MAX_TIER, tier + 1);
  }
  return result === 'demoted' ? Math.max(0, tier - 1) : tier;
}

export interface Rankable {
  userId: string;
  joinedAt: Date;
  xp: number;
}

// Most XP first; ties go to whoever joined the bracket first, then by id, so
// the order is the same every time it's computed.
export function rankEntries<T extends Rankable>(
  entries: T[],
): (T & { rank: number })[] {
  return [...entries]
    .sort(
      (a, b) =>
        b.xp - a.xp ||
        a.joinedAt.getTime() - b.joinedAt.getTime() ||
        a.userId.localeCompare(b.userId),
    )
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function weekKey(weekStart: Date): string {
  return weekStart.toISOString().slice(0, 10);
}

export function previousWeekStart(weekStart: Date): Date {
  return new Date(weekStart.getTime() - 7 * DAY_MS);
}

export function nextWeekStart(weekStart: Date): Date {
  return new Date(weekStart.getTime() + 7 * DAY_MS);
}
