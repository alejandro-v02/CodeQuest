import type { SeedModule } from '../curriculum.data';
import { funcionesParte1 } from './modulo-funciones-1';
import { funcionesParte2 } from './modulo-funciones-2';

export const moduloFunciones: SeedModule = {
  title: 'Funciones y genéricos',
  lessons: [...funcionesParte1, ...funcionesParte2],
};
