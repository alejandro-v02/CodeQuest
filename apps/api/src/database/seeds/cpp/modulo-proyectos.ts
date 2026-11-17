import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { INCLUDES } from './common';

export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    {
      title: 'Proyecto: calculadora',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: calculadora

Vas a construir una calculadora que lee operaciones como §6 + 3§ y calcula el resultado, tratando los casos especiales.

## Paso 1: leer la operación

§cin >>§ separa por espacios, así que una línea como §6 + 3§ se lee directamente en tres variables:

§§§cpp
double a, b;
char op;
cin >> a >> op >> b;
§§§

§op§ es un §char§: guarda un solo carácter (§'+'§, §'-'§, §'*'§ o §'/'§).

## Paso 2: la función que calcula

§§§cpp
double calcular(double a, char op, double b) {
switch (op) {
case '+': return a + b;
case '-': return a - b;
case '*': return a * b;
default: return a / b;
}
}
§§§

## Paso 3: casos especiales

La división entre cero no es un error de compilación, así que hay que tratarla tú:

§§§cpp
if (op == '/' && b == 0) {
cout << "error" << endl;
} else {
cout << fixed << setprecision(2) << calcular(a, op, b) << endl;
}
§§§

## Paso 4: varias operaciones

Para procesar todas las líneas de la entrada:

§§§cpp
while (cin >> a >> op >> b) {
// calcular e imprimir cada una
}
§§§

## Qué has practicado

Lectura con §cin§, §char§, §switch§, funciones, formato de decimales y casos límite.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código con la entrada `6 / 4`?',
          difficulty: 1,
          payload: {
            code: "double a, b;\nchar op;\ncin >> a >> op >> b;\nif (op == '/') cout << a / b;",
            options: ['1', '1.5', '2', '6 / 4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué tipo se usa para guardar un solo carácter como `+`?',
          difficulty: 1,
          payload: {
            code: "____ op = '+';",
            options: ['string', 'int', 'char', 'bool'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa el `switch` para que `-` reste.',
          difficulty: 2,
          payload: {
            template:
              "switch (op) {\n  case '+': return a + b;\n  {{0}} '-': return a - b;\n  {{1}}: return a * b;\n}",
            blanks: ['case', 'default'],
          },
        },
        {
          type: 'bug',
          prompt:
            'La calculadora suma cuando debería restar. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'double calcular(double a, char op, double b) {',
              "  if (op == '+') return a + b;",
              "  if (op == '-') return a + b;",
              '  return a * b;',
              '}',
            ],
            buggyLineIndex: 2,
            explanation: "Para '-' debe devolver a - b, no a + b.",
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que leen una operación y la calculan.',
          difficulty: 2,
          payload: {
            blocks: [
              'double a, b;',
              'char op;',
              'cin >> a >> op >> b;',
              'cout << calcular(a, op, b) << endl;',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una operación como `6 + 3` (`+ - * /`) e imprime el resultado con 2 decimales. Si divides entre cero, imprime `error`.',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  cin >> a >> op >> b;\n  // TODO\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  cin >> a >> op >> b;\n  if (op == '/' && b == 0) {\n    cout << "error" << endl;\n  } else {\n    cout << fixed << setprecision(2) << calcular(a, op, b) << endl;\n  }\n  return 0;\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '6 + 3', expectedOutput: '9.00', isHidden: false },
            { input: '10 / 4', expectedOutput: '2.50', isHidden: false },
            { input: '5 / 0', expectedOutput: 'error', isHidden: false },
            { input: '7 * 6', expectedOutput: '42.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación (`a op b`). Imprime el resultado de cada una con 2 decimales, en su línea; si divide entre cero, imprime `error`.',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  while (cin >> a >> op >> b) {\n    // TODO\n  }\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  while (cin >> a >> op >> b) {\n    if (op == '/' && b == 0) {\n      cout << "error" << endl;\n    } else {\n      cout << fixed << setprecision(2) << calcular(a, op, b) << endl;\n    }\n  }\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '1 + 2\n8 / 2',
              expectedOutput: '3.00\n4.00',
              isHidden: false,
            },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '20.00\nerror\n-1.00',
              isHidden: false,
            },
            { input: '2 - 2', expectedOutput: '0.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación. Imprime la **suma de todos los resultados** con 2 decimales (ignora las divisiones entre cero).',
          starterCode: `${INCLUDES}double calcular(double a, char op, double b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  double a, b;\n  char op;\n  double total = 0;\n  while (cin >> a >> op >> b) {\n    // TODO\n  }\n  cout << fixed << setprecision(2) << total << endl;\n  return 0;\n}\n`,
          solution: `${INCLUDES}double calcular(double a, char op, double b) {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    default:\n      return a / b;\n  }\n}\n\nint main() {\n  double a, b;\n  char op;\n  double total = 0;\n  while (cin >> a >> op >> b) {\n    if (op == '/' && b == 0) {\n      continue;\n    }\n    total += calcular(a, op, b);\n  }\n  cout << fixed << setprecision(2) << total << endl;\n  return 0;\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '1 + 2\n8 / 2', expectedOutput: '7.00', isHidden: false },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '19.00',
              isHidden: false,
            },
            { input: '5 / 0', expectedOutput: '0.00', isHidden: true },
          ],
        },
      ],
    },
    { title: 'Proyecto: inventario', xpReward: 20, contentMarkdown: null },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 20,
      contentMarkdown: null,
    },
  ],
};
