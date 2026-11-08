import type { ProgrammingLanguageSlug } from '../../modules/users/entities/user.entity';

export interface ConceptSeed {
  slug: string;
  name: string;
}

// Mirrors curriculum.data.ts's lesson titles for the languages/topics that
// already have written lessons, so the Fase 5A generator practices exactly
// what the curriculum already teaches. TypeScript/C++ stay partial here
// because their lesson content is still partial too (see Lesson entity).
export const conceptsByLanguage: Record<
  ProgrammingLanguageSlug,
  ConceptSeed[]
> = {
  python: [
    { slug: 'variables', name: 'Variables y asignación' },
    { slug: 'tipos-basicos', name: 'Tipos de datos básicos' },
    { slug: 'condicionales', name: 'Condicionales' },
    { slug: 'bucles', name: 'Bucles' },
    { slug: 'funciones', name: 'Funciones' },
    { slug: 'listas', name: 'Listas' },
    { slug: 'diccionarios', name: 'Diccionarios' },
  ],
  javascript: [
    { slug: 'variables', name: 'Variables y asignación' },
    { slug: 'tipos-basicos', name: 'Tipos de datos básicos' },
    { slug: 'condicionales', name: 'Condicionales' },
    { slug: 'bucles', name: 'Bucles' },
    { slug: 'funciones', name: 'Funciones' },
    { slug: 'arrays', name: 'Arrays' },
    { slug: 'objetos', name: 'Objetos' },
  ],
  typescript: [
    { slug: 'variables-tipos', name: 'Variables y tipos explícitos' },
    { slug: 'tipos-anotaciones', name: 'Tipos básicos y anotaciones' },
    { slug: 'interfaces-objetos', name: 'Interfaces y objetos' },
  ],
  cpp: [{ slug: 'tipos-basicos', name: 'Tipos de datos básicos' }],
};
