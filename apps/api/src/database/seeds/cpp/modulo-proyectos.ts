import type { SeedModule } from '../curriculum.data';

// Lessons keep their place in the map; their content and exercises are
// written module by module (see docs/cpp-sandbox.md).
export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    { title: 'Proyecto: calculadora', xpReward: 10, contentMarkdown: null },
    { title: 'Proyecto: inventario', xpReward: 10, contentMarkdown: null },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 10,
      contentMarkdown: null,
    },
  ],
};
