// Monday 00:00 UTC of the current week — rankings don't need per-user
// timezone precision, a single server-wide boundary is enough.
export function startOfIsoWeekUtc(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - diffToMonday,
    ),
  );
}
