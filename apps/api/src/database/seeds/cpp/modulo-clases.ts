import type { SeedModule } from '../curriculum.data';

// Lessons keep their place in the map; their content and exercises are
// written module by module (see docs/cpp-sandbox.md).
export const moduloClases: SeedModule = {
  title: 'Clases',
  lessons: [
    { title: 'Clases y objetos', xpReward: 10, contentMarkdown: null },
    {
      title: 'Constructores y encapsulación',
      xpReward: 10,
      contentMarkdown: null,
    },
    { title: 'Herencia y polimorfismo', xpReward: 10, contentMarkdown: null },
  ],
};
