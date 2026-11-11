import { QuotaBreaker, isQuotaError } from './quota-breaker';

describe('QuotaBreaker', () => {
  it('starts closed', () => {
    expect(new QuotaBreaker(1000, () => 0).isOpen).toBe(false);
  });

  it('opens when tripped and closes again after the cooldown', () => {
    let now = 1_000;
    const breaker = new QuotaBreaker(5_000, () => now);

    breaker.trip();
    expect(breaker.isOpen).toBe(true);

    now = 5_999;
    expect(breaker.isOpen).toBe(true);

    now = 6_000;
    expect(breaker.isOpen).toBe(false);
  });

  it('restarts the cooldown when tripped again', () => {
    let now = 0;
    const breaker = new QuotaBreaker(1_000, () => now);

    breaker.trip();
    now = 900;
    breaker.trip();
    now = 1_500;
    expect(breaker.isOpen).toBe(true);
    now = 1_900;
    expect(breaker.isOpen).toBe(false);
  });
});

describe('isQuotaError', () => {
  it('recognizes an HTTP 429', () => {
    expect(
      isQuotaError({ status: 429, message: 'You exceeded your quota' }),
    ).toBe(true);
  });

  it('recognizes RESOURCE_EXHAUSTED even without a status', () => {
    expect(
      isQuotaError(new Error('{"error":{"status":"RESOURCE_EXHAUSTED"}}')),
    ).toBe(true);
  });

  it('ignores other failures', () => {
    expect(isQuotaError({ status: 500, message: 'boom' })).toBe(false);
    expect(isQuotaError(new Error('network down'))).toBe(false);
    expect(isQuotaError(null)).toBe(false);
    expect(isQuotaError('429')).toBe(false);
  });
});
