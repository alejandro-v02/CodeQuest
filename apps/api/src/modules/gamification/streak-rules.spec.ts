import {
  MAX_STREAK_FREEZES,
  advanceStreak,
  type StreakState,
} from './streak-rules';

const state = (overrides: Partial<StreakState> = {}): StreakState => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  freezes: 0,
  ...overrides,
});

describe('advanceStreak', () => {
  it('starts a streak on the first activity', () => {
    expect(advanceStreak(state(), '2026-11-10')).toMatchObject({
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: '2026-11-10',
    });
  });

  it('ignores a second activity on the same day', () => {
    const before = state({
      currentStreak: 3,
      longestStreak: 3,
      lastActivityDate: '2026-11-10',
    });
    expect(advanceStreak(before, '2026-11-10')).toBe(before);
  });

  it('continues the streak on consecutive days', () => {
    const next = advanceStreak(
      state({
        currentStreak: 3,
        longestStreak: 3,
        lastActivityDate: '2026-11-09',
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(4);
    expect(next.longestStreak).toBe(4);
  });

  it('resets after a missed day when there is no freeze', () => {
    const next = advanceStreak(
      state({
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: '2026-11-08',
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(1);
    expect(next.longestStreak).toBe(5);
  });

  it('spends one freeze to cover one missed day', () => {
    const next = advanceStreak(
      state({
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: '2026-11-08',
        freezes: 1,
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(6);
    expect(next.freezes).toBe(0);
  });

  it('does not stretch one freeze across two missed days', () => {
    const next = advanceStreak(
      state({
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: '2026-11-07',
        freezes: 1,
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(1);
    expect(next.freezes).toBe(1);
  });

  it('spends two freezes to cover two missed days', () => {
    const next = advanceStreak(
      state({
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: '2026-11-07',
        freezes: 2,
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(6);
    expect(next.freezes).toBe(0);
  });

  it('earns a freeze at every 7th day of streak', () => {
    const next = advanceStreak(
      state({
        currentStreak: 6,
        longestStreak: 6,
        lastActivityDate: '2026-11-09',
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(7);
    expect(next.freezes).toBe(1);
  });

  it('never holds more than the maximum number of freezes', () => {
    const next = advanceStreak(
      state({
        currentStreak: 13,
        longestStreak: 13,
        lastActivityDate: '2026-11-09',
        freezes: MAX_STREAK_FREEZES,
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(14);
    expect(next.freezes).toBe(MAX_STREAK_FREEZES);
  });

  it('keeps the old longest streak after a reset', () => {
    const next = advanceStreak(
      state({
        currentStreak: 9,
        longestStreak: 12,
        lastActivityDate: '2026-10-01',
      }),
      '2026-11-10',
    );
    expect(next.currentStreak).toBe(1);
    expect(next.longestStreak).toBe(12);
  });
});
