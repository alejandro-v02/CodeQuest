import type { SeedLesson, SeedModule } from '../curriculum.data';
import { fundamentosParte1 } from './fundamentos-1';

// Lessons whose content is still to be written keep their place in the map
// (seed.ts matches lessons by position, so they can't move later).
const pendientes: SeedLesson[] = [
  { title: 'Bucles', xpReward: 10, contentMarkdown: null },
  { title: 'Funciones tipadas', xpReward: 10, contentMarkdown: null },
  { title: 'Arrays tipados', xpReward: 10, contentMarkdown: null },
  { title: 'Interfaces y objetos', xpReward: 10, contentMarkdown: null },
];

export const moduloFundamentos: SeedModule = {
  title: 'Fundamentos',
  lessons: [...fundamentosParte1, ...pendientes],
};
