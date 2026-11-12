import type { SeedModule } from '../curriculum.data';
import { moduloTipos } from './modulo-tipos';

// Order here is the order in the app. Only ever append: seed.ts matches
// modules by position, so inserting in the middle would overwrite rows that
// users already have progress on.
export const typescriptExtraModules: SeedModule[] = [moduloTipos];
