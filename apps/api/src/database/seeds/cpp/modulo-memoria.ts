import type { SeedModule } from '../curriculum.data';

// Lessons keep their place in the map; their content and exercises are
// written module by module (see docs/cpp-sandbox.md).
export const moduloMemoria: SeedModule = {
  title: 'Funciones y memoria',
  lessons: [
    { title: 'Parámetros y retorno', xpReward: 10, contentMarkdown: null },
    { title: 'Referencias', xpReward: 10, contentMarkdown: null },
    { title: 'Punteros', xpReward: 10, contentMarkdown: null },
    { title: 'const y buenas prácticas', xpReward: 10, contentMarkdown: null },
  ],
};
