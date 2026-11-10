// Curated avatar options — no file-upload infra exists in this project, so
// personalization is an icon+color pair instead of a photo. Icon names are
// ionicons slugs, registered client-side in core/config/icons.ts.
export const AVATAR_ICONS = [
  'person-circle',
  'rocket-outline',
  'planet-outline',
  'game-controller-outline',
  'paw-outline',
  'leaf-outline',
  'skull-outline',
  'diamond-outline',
] as const;

export const AVATAR_COLORS = [
  '#22d3ee',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
  '#4ade80',
  '#facc15',
] as const;
