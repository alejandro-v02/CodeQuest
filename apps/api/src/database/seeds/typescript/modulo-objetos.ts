import type { SeedModule } from '../curriculum.data';
import { objetosParte1 } from './modulo-objetos-1';
import { objetosParte2 } from './modulo-objetos-2';

export const moduloObjetos: SeedModule = {
  title: 'Objetos y clases',
  lessons: [...objetosParte1, ...objetosParte2],
};
