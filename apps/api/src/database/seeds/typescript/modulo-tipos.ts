import type { SeedModule } from '../curriculum.data';
import { tiposParte1 } from './modulo-tipos-1';
import { tiposParte2 } from './modulo-tipos-2';

export const moduloTipos: SeedModule = {
  title: 'Tipos en profundidad',
  lessons: [...tiposParte1, ...tiposParte2],
};
