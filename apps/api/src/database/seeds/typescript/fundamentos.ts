import type { SeedModule } from '../curriculum.data';
import { fundamentosParte1 } from './fundamentos-1';
import { fundamentosParte2 } from './fundamentos-2';
import { fundamentosParte3 } from './fundamentos-3';

export const moduloFundamentos: SeedModule = {
  title: 'Fundamentos',
  lessons: [...fundamentosParte1, ...fundamentosParte2, ...fundamentosParte3],
};
