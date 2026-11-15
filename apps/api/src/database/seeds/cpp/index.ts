import type { SeedModule } from '../curriculum.data';
import { moduloCadenas } from './modulo-cadenas';
import { moduloMemoria } from './modulo-memoria';
import { moduloClases } from './modulo-clases';
import { moduloErrores } from './modulo-errores';
import { moduloProyectos } from './modulo-proyectos';

// Order here is the order in the app, after the base "Fundamentos" module.
// Only ever append: seed.ts matches modules by position, so inserting in the
// middle would overwrite rows that users already have progress on.
export const cppExtraModules: SeedModule[] = [
  moduloCadenas,
  moduloMemoria,
  moduloClases,
  moduloErrores,
  moduloProyectos,
];
