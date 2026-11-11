import type { EventPropValue } from './entities/analytics-event.entity';

// Events the mobile app may send. Anything else is rejected, so the table
// can't be filled with arbitrary names. Server-side events (like
// 'ai_limit_hit') are recorded directly and aren't in this list.
export const CLIENT_EVENT_NAMES = [
  'app_open',
  'screen_view',
  'language_changed',
  'league_opened',
  'group_created',
  'group_joined',
  'practice_started',
] as const;

export const MAX_EVENTS_PER_BATCH = 20;
const MAX_PROPS = 5;
const MAX_KEY_LENGTH = 30;
const MAX_STRING_LENGTH = 60;

// Keeps only flat, short, primitive props. Invalid entries are dropped rather
// than rejecting the whole event: analytics must never break the app.
export function sanitizeProps(
  raw: unknown,
): Record<string, EventPropValue> | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return null;
  }

  const clean: Record<string, EventPropValue> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Object.keys(clean).length >= MAX_PROPS) {
      break;
    }
    if (key.length === 0 || key.length > MAX_KEY_LENGTH) {
      continue;
    }
    if (typeof value === 'string') {
      clean[key] = value.slice(0, MAX_STRING_LENGTH);
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      clean[key] = value;
    } else if (typeof value === 'boolean') {
      clean[key] = value;
    }
  }
  return Object.keys(clean).length > 0 ? clean : null;
}
