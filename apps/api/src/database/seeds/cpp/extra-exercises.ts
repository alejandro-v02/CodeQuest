import type { SeedExercise } from '../curriculum.data';
import { FIN, INCLUDES, PLANTILLA } from './common';

// Extra exercises appended (by lesson title) to the C++ "Fundamentos"
// lessons; appending keeps existing exercise ids stable.
export const cppExtraExercises: Record<string, SeedExercise[]> = {
  'Variables y tipos': [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'int a = 4;\na = a + 3;\na += 2;\ncout << a;',
        options: ['4', '7', '9', '12'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Declara una variable de texto y muéstrala.',
      difficulty: 1,
      payload: {
        template: '{{0}} nombre = "Ana";\ncout << {{1}} << endl;',
        blanks: ['string', 'nombre'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee tres números enteros (uno por línea) e imprime su suma, su producto, y el mayor, separados por espacios.',
      starterCode: PLANTILLA,
      solution: `${INCLUDES}int main() {\n  int a, b, c;\n  cin >> a >> b >> c;\n  int mayor = max(a, max(b, c));\n  cout << a + b + c << " " << a * b * c << " " << mayor << endl;\n${FIN}`,
      difficulty: 2,
      testCases: [
        { input: '1\n2\n3', expectedOutput: '6 6 3', isHidden: false },
        { input: '5\n-2\n4', expectedOutput: '7 -40 5', isHidden: false },
        { input: '0 0 0', expectedOutput: '0 0 0', isHidden: true },
      ],
    },
  ],
  'Tipos de datos básicos': [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'cout << 10 / 4 << " " << 10 % 4 << " " << 10 / 4.0;',
        options: ['2 2 2.5', '2.5 2 2.5', '2 2 2', '2 0 2.5'],
        correctIndex: 0,
      },
    },
    {
      type: 'bug',
      prompt:
        'El resultado debería ser 0.5 y sale 0. ¿Qué línea tiene el problema?',
      difficulty: 2,
      payload: {
        lines: [
          'int a = 1;',
          'int b = 2;',
          'double mitad = a / b;',
          'cout << mitad << endl;',
        ],
        buggyLineIndex: 2,
        explanation:
          'a / b divide dos enteros y da 0. Hay que convertir uno: static_cast<double>(a) / b.',
      },
    },
    {
      type: 'code',
      prompt:
        'Lee un número de segundos e imprime cuántas horas, minutos y segundos son, en formato `h:m:s`.',
      starterCode: PLANTILLA,
      solution: `${INCLUDES}int main() {\n  int total;\n  cin >> total;\n  int horas = total / 3600;\n  int minutos = (total % 3600) / 60;\n  int segundos = total % 60;\n  cout << horas << ":" << minutos << ":" << segundos << endl;\n${FIN}`,
      difficulty: 2,
      testCases: [
        { input: '3661', expectedOutput: '1:1:1', isHidden: false },
        { input: '59', expectedOutput: '0:0:59', isHidden: false },
        { input: '7325', expectedOutput: '2:2:5', isHidden: true },
      ],
    },
  ],
};
