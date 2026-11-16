import type { SeedLesson, SeedModule } from '../curriculum.data';
import { fundamentosParte1 } from './fundamentos-1';
import { fundamentosParte2 } from './fundamentos-2';

// Lessons whose content is still to be written keep their place in the map
// (seed.ts matches lessons by position, so they can't move later).
const pendientes: SeedLesson[] = [
  { title: 'Arrays y vectores', xpReward: 10, contentMarkdown: null },
  { title: 'Structs', xpReward: 10, contentMarkdown: null },
];

export const moduloFundamentos: SeedModule = {
  title: 'Fundamentos',
  lessons: [...fundamentosParte1, ...fundamentosParte2, ...pendientes],
};
