import type { SeedModule } from '../curriculum.data';
import { moduloEntradaSalida } from './modulo-entrada-salida';
import { moduloCadenas } from './modulo-cadenas';
import { moduloEstructuras } from './modulo-estructuras';
import { moduloFunciones } from './modulo-funciones';
import { moduloErrores } from './modulo-errores';
import { moduloProyectos } from './modulo-proyectos';

// Order here is the order in the app. Only ever append: seed.ts matches
// modules by position, so inserting in the middle would overwrite rows that
// users already have progress on.
export const javascriptExtraModules: SeedModule[] = [
  moduloEntradaSalida,
  moduloCadenas,
  moduloEstructuras,
  moduloFunciones,
  moduloErrores,
  moduloProyectos,
];
