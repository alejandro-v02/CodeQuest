export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

// Mirrors the backend's ACHIEVEMENTS_CATALOG (apps/api .../gamification/achievements.catalog.ts).
// Automatic milestone posts only store achievementSlug, not display copy —
// this catalog resolves it client-side so the text lives in one place.
export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  {
    slug: 'first_exercise',
    title: 'Primer paso',
    description: 'Resolvió su primer ejercicio.',
    icon: 'flag-outline',
  },
  {
    slug: 'streak_7',
    title: 'Racha de 7 días',
    description: 'Practicó 7 días seguidos.',
    icon: 'flame-outline',
  },
  {
    slug: 'no_hints_10',
    title: 'Sin ayuda',
    description: 'Resolvió 10 ejercicios seguidos sin usar pistas.',
    icon: 'bulb-outline',
  },
];

export function findAchievement(slug: string): AchievementDefinition | null {
  return ACHIEVEMENTS_CATALOG.find((a) => a.slug === slug) ?? null;
}
