// After the AI provider answers "quota exceeded" (or out of credit), every
// further call fails the same way until that's fixed, so it's pointless (and
// noisy) to keep asking. The breaker stays open for a cooldown, then lets one
// call through to find out whether the quota is back.
export class QuotaBreaker {
  private blockedUntil = 0;

  constructor(
    private readonly cooldownMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  get isOpen(): boolean {
    return this.now() < this.blockedUntil;
  }

  trip(): void {
    this.blockedUntil = this.now() + this.cooldownMs;
  }
}

// OpenAI answers 429 both for rate limits and for exhausted credit; errors
// carry the HTTP status. The text check covers wrappers that only keep the
// message.
export function isQuotaError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const { status, message } = error as { status?: unknown; message?: unknown };
  return (
    status === 429 ||
    (typeof message === 'string' && message.includes('RESOURCE_EXHAUSTED'))
  );
}
