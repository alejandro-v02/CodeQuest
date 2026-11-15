import type { SeedModule } from '../curriculum.data';

// Lessons keep their place in the map; their content and exercises are
// written module by module (see docs/cpp-sandbox.md).
export const moduloErrores: SeedModule = {
  title: 'Errores y depuración',
  lessons: [
    {
      title: 'Leer errores del compilador',
      xpReward: 10,
      contentMarkdown: null,
    },
    { title: 'Excepciones', xpReward: 10, contentMarkdown: null },
  ],
};
