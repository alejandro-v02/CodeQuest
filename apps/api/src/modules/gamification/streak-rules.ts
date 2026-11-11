export const MAX_STREAK_FREEZES = 2;
// A streak freeze is earned every time the streak reaches a multiple of this.
export const DAYS_PER_FREEZE = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  // 'YYYY-MM-DD' in the user's own timezone.
  lastActivityDate: string | null;
  freezes: number;
}

function daysBetween(from: string, to: string): number {
  return Math.round(
    (new Date(`${to}T00:00:00Z`).getTime() -
      new Date(`${from}T00:00:00Z`).getTime()) /
      DAY_MS,
  );
}

// State after the user is active on `today`. Each freeze covers one missed
// day, so a gap longer than the freezes available still breaks the streak.
// Covered days don't add to the streak, they only keep it alive.
export function advanceStreak(state: StreakState, today: string): StreakState {
  if (state.lastActivityDate === today) {
    return state;
  }

  let current = 1;
  let freezes = state.freezes;

  if (state.lastActivityDate !== null) {
    const missedDays = Math.max(
      0,
      daysBetween(state.lastActivityDate, today) - 1,
    );
    if (missedDays <= freezes) {
      current = state.currentStreak + 1;
      freezes -= missedDays;
    }
  }

  if (current > 1 && current % DAYS_PER_FREEZE === 0) {
    freezes = Math.min(MAX_STREAK_FREEZES, freezes + 1);
  }

  return {
    currentStreak: current,
    longestStreak: Math.max(state.longestStreak, current),
    lastActivityDate: today,
    freezes,
  };
}
