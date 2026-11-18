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
  Condicionales: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'int x = 7;\nstring r = (x % 2 == 0) ? "par" : (x > 5 ? "impar grande" : "impar chico");\ncout << r;',
        options: ['par', 'impar grande', 'impar chico', 'Error de compilación'],
        correctIndex: 1,
      },
    },
    {
      type: 'fill',
      prompt: 'Completa el `switch` para que el día 2 imprima "martes".',
      difficulty: 1,
      payload: {
        template:
          'switch (dia) {\n  case 1: cout << "lunes"; {{0}};\n  {{1}} 2: cout << "martes"; break;\n}',
        blanks: ['break', 'case'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee tres números e imprime `triangulo` si pueden ser los lados de un triángulo (cada lado menor que la suma de los otros dos) o `no` si no.',
      starterCode: PLANTILLA,
      solution: `${INCLUDES}int main() {\n  int a, b, c;\n  cin >> a >> b >> c;\n  bool valido = a < b + c && b < a + c && c < a + b;\n  cout << (valido ? "triangulo" : "no") << endl;\n${FIN}`,
      difficulty: 2,
      testCases: [
        { input: '3\n4\n5', expectedOutput: 'triangulo', isHidden: false },
        { input: '1\n2\n10', expectedOutput: 'no', isHidden: false },
        { input: '5 5 5', expectedOutput: 'triangulo', isHidden: true },
      ],
    },
  ],
  Bucles: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'int suma = 0;\nfor (int i = 1; i <= 10; i++) {\n  if (i % 2 == 0) continue;\n  suma += i;\n}\ncout << suma;',
        options: ['55', '30', '25', '20'],
        correctIndex: 2,
      },
    },
    {
      type: 'sort',
      prompt: 'Ordena las líneas que cuentan los dígitos de un número.',
      difficulty: 3,
      payload: {
        blocks: [
          'int digitos = 0;',
          'while (n > 0) {',
          '  n = n / 10;',
          '  digitos++;',
          '}',
          'cout << digitos << endl;',
        ],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee un número N e imprime una escalera de N líneas: la línea `i` tiene `i` asteriscos.',
      starterCode: PLANTILLA,
      solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  for (int i = 1; i <= n; i++) {\n    for (int j = 0; j < i; j++) {\n      cout << "*";\n    }\n    cout << endl;\n  }\n${FIN}`,
      difficulty: 2,
      testCases: [
        { input: '3', expectedOutput: '*\n**\n***', isHidden: false },
        { input: '1', expectedOutput: '*', isHidden: false },
        {
          input: '5',
          expectedOutput: '*\n**\n***\n****\n*****',
          isHidden: true,
        },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee un número positivo e imprime cuántos dígitos tiene, usando un bucle `while` (sin convertirlo a texto).',
      starterCode: PLANTILLA,
      solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  int digitos = 0;\n  while (n > 0) {\n    n = n / 10;\n    digitos++;\n  }\n  cout << digitos << endl;\n${FIN}`,
      difficulty: 2,
      testCases: [
        { input: '12345', expectedOutput: '5', isHidden: false },
        { input: '7', expectedOutput: '1', isHidden: false },
        { input: '1000', expectedOutput: '4', isHidden: true },
      ],
    },
  ],
};
