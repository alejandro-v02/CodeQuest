export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

// MVP de Fase 6: exactamente los 3 logros listados en PLAN.md. Catálogo
// hardcodeado porque no hay (ni se planea) una UI de administración para
// autorearlos — agregar uno nuevo es agregar una entrada aquí y el check
// correspondiente en GamificationService.
export const ACHIEVEMENTS_CATALOG: AchievementDefinition[] = [
  {
    slug: 'first_exercise',
    title: 'Primer paso',
    description: 'Resolviste tu primer ejercicio.',
    icon: 'flag-outline',
  },
  {
    slug: 'streak_7',
    title: 'Racha de 7 días',
    description: 'Practicaste 7 días seguidos.',
    icon: 'flame-outline',
  },
  {
    slug: 'no_hints_10',
    title: 'Sin ayuda',
    description: 'Resolviste 10 ejercicios seguidos sin usar pistas.',
    icon: 'bulb-outline',
  },
];
