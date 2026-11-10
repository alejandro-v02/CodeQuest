import {
  MAX_TIER,
  nextTier,
  rankEntries,
  resultFor,
  weekKey,
  zoneFor,
  zoneSize,
} from './league-rules';

describe('league rules', () => {
  describe('zoneSize', () => {
    it('is 0 below three people', () => {
      expect(zoneSize(1)).toBe(0);
      expect(zoneSize(2)).toBe(0);
    });

    it('is a third of a small bracket and caps at 5', () => {
      expect(zoneSize(3)).toBe(1);
      expect(zoneSize(9)).toBe(3);
      expect(zoneSize(15)).toBe(5);
      expect(zoneSize(30)).toBe(5);
    });
  });

  describe('zoneFor', () => {
    it('promotes the top places that earned XP', () => {
      expect(zoneFor(1, 30, 1, 120)).toBe('promote');
      expect(zoneFor(5, 30, 1, 10)).toBe('promote');
      expect(zoneFor(6, 30, 1, 10)).toBe('safe');
    });

    it('does not promote someone with 0 XP', () => {
      expect(zoneFor(1, 30, 1, 0)).toBe('safe');
    });

    it('demotes the bottom places', () => {
      expect(zoneFor(30, 30, 2, 0)).toBe('demote');
      expect(zoneFor(26, 30, 2, 5)).toBe('demote');
      expect(zoneFor(25, 30, 2, 5)).toBe('safe');
    });

    it('never promotes past the top tier or demotes below the bottom', () => {
      expect(zoneFor(1, 30, MAX_TIER, 500)).toBe('safe');
      expect(zoneFor(30, 30, 0, 0)).toBe('safe');
    });

    it('leaves tiny brackets alone', () => {
      expect(zoneFor(1, 2, 1, 100)).toBe('safe');
      expect(zoneFor(2, 2, 1, 0)).toBe('safe');
    });
  });

  describe('nextTier', () => {
    it('moves one tier within bounds', () => {
      expect(nextTier(1, resultFor('promote'))).toBe(2);
      expect(nextTier(1, resultFor('demote'))).toBe(0);
      expect(nextTier(1, resultFor('safe'))).toBe(1);
      expect(nextTier(MAX_TIER, 'promoted')).toBe(MAX_TIER);
      expect(nextTier(0, 'demoted')).toBe(0);
    });
  });

  describe('rankEntries', () => {
    const early = new Date('2026-11-09T10:00:00Z');
    const late = new Date('2026-11-09T12:00:00Z');

    it('orders by XP, then by who joined first, then by id', () => {
      const ranked = rankEntries([
        { userId: 'c', joinedAt: late, xp: 50 },
        { userId: 'b', joinedAt: early, xp: 50 },
        { userId: 'a', joinedAt: early, xp: 50 },
        { userId: 'd', joinedAt: late, xp: 90 },
      ]);
      expect(ranked.map((entry) => entry.userId)).toEqual(['d', 'a', 'b', 'c']);
      expect(ranked.map((entry) => entry.rank)).toEqual([1, 2, 3, 4]);
    });
  });

  it('formats the week key as YYYY-MM-DD', () => {
    expect(weekKey(new Date('2026-11-09T00:00:00Z'))).toBe('2026-11-09');
  });
});
