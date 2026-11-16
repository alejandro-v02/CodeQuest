import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { FIN, INCLUDES, PLANTILLA } from './common';

// Fundamentos, lecciones 4-5.
export const fundamentosParte2: SeedLesson[] = [
  {
    title: 'Bucles',
    xpReward: 10,
    contentMarkdown: md`
# Bucles

Un bucle repite un bloque de código mientras se cumpla una condición.

## for

§§§cpp
for (int i = 1; i <= 3; i++) {
cout << i << endl;
}
// 1, 2, 3
§§§

Tiene tres partes: **inicio** (§int i = 1§), **condición** (§i <= 3§) y **paso** (§i++§, que suma 1 a §i§ en cada vuelta). Usa §for§ cuando sabes cuántas vueltas habrá.

## while

Repite mientras la condición sea verdadera. Útil cuando no sabes cuántas vueltas harán falta.

§§§cpp
int n = 100;
int pasos = 0;
while (n > 1) {
n = n / 2;
pasos++;
}
§§§

Cuidado con los **bucles infinitos**: algo dentro debe acercar la condición a falsa.

## do-while

Igual que §while§, pero la condición se comprueba **al final**: el bloque se ejecuta al menos una vez.

§§§cpp
int i = 10;
do {
cout << i << endl; // se imprime 10 aunque 10 < 5 sea falso
} while (i < 5);
§§§

## Leer hasta el final de la entrada

§§§cpp
int x, suma = 0;
while (cin >> x) {
suma += x;
}
§§§

§cin >> x§ devuelve falso cuando ya no quedan datos: es la forma habitual de leer "todos los números".

## break y continue

- §break§ sale del bucle de inmediato.
- §continue§ salta a la siguiente vuelta.

## Números grandes

Un factorial crece muy rápido: §20!§ ya no cabe en un §int§. Usa §long long§ para acumular.

§§§cpp
long long resultado = 1;
for (int i = 2; i <= n; i++) {
resultado *= i;
}
§§§

## Recuerda

- §i++§ es lo mismo que §i = i + 1§.
- Un acumulador (§suma§, §resultado§) se declara **antes** del bucle y se actualiza dentro.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'for (int i = 0; i < 3; i++) {\n  cout << i << " ";\n}',
          options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Cuántas vueltas da este bucle?',
        difficulty: 2,
        payload: {
          code: 'int i = 0;\nwhile (i < 5) {\n  i += 2;\n}',
          options: ['2', '3', '4', '5'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'int i = 10;\ndo {\n  cout << i;\n} while (i < 5);',
          options: ['Nada', '10', '5', 'Entra en un bucle infinito'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa el bucle para contar de 1 a 5.',
        difficulty: 1,
        payload: {
          template:
            'for (int i = {{0}}; i <= 5; i{{1}}) {\n  cout << i << endl;\n}',
          blanks: ['1', '++'],
        },
      },
      {
        type: 'bug',
        prompt: 'Este bucle nunca termina. ¿Qué línea tiene el error?',
        difficulty: 2,
        payload: {
          lines: [
            'int suma = 0;',
            'for (int i = 1; i <= 5; i--) {',
            '  suma += i;',
            '}',
            'cout << suma;',
          ],
          buggyLineIndex: 1,
          explanation:
            'i empieza en 1 y baja con i--, así que nunca supera 5. Debe subir con i++.',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas que suman los números del 1 al 4.',
        difficulty: 2,
        payload: {
          blocks: [
            'int suma = 0;',
            'for (int i = 1; i <= 4; i++) {',
            '  suma += i;',
            '}',
            'cout << suma << endl;',
          ],
        },
      },
      {
        type: 'code',
        prompt: 'Lee un número N e imprime la suma de los enteros de 1 a N.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  int suma = 0;\n  for (int i = 1; i <= n; i++) {\n    suma += i;\n  }\n  cout << suma << endl;\n${FIN}`,
        difficulty: 1,
        testCases: [
          { input: '5', expectedOutput: '15', isHidden: false },
          { input: '1', expectedOutput: '1', isHidden: false },
          { input: '100', expectedOutput: '5050', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un número N e imprime su tabla de multiplicar del 1 al 10, una línea por cada `N x i = resultado`.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  for (int i = 1; i <= 10; i++) {\n    cout << n << " x " << i << " = " << n * i << endl;\n  }\n${FIN}`,
        difficulty: 2,
        testCases: [
          {
            input: '3',
            expectedOutput:
              '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
            isHidden: false,
          },
          {
            input: '10',
            expectedOutput:
              '10 x 1 = 10\n10 x 2 = 20\n10 x 3 = 30\n10 x 4 = 40\n10 x 5 = 50\n10 x 6 = 60\n10 x 7 = 70\n10 x 8 = 80\n10 x 9 = 90\n10 x 10 = 100',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un número N e imprime su factorial (N! = 1 × 2 × … × N). El factorial de 0 es 1. Usa `long long`.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int n;\n  cin >> n;\n  long long resultado = 1;\n  for (int i = 2; i <= n; i++) {\n    resultado *= i;\n  }\n  cout << resultado << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '5', expectedOutput: '120', isHidden: false },
          { input: '0', expectedOutput: '1', isHidden: false },
          { input: '15', expectedOutput: '1307674368000', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una lista de enteros (todos los que haya hasta el final de la entrada) e imprime cuántos son positivos.',
        starterCode: PLANTILLA,
        solution: `${INCLUDES}int main() {\n  int x, positivos = 0;\n  while (cin >> x) {\n    if (x > 0) {\n      positivos++;\n    }\n  }\n  cout << positivos << endl;\n${FIN}`,
        difficulty: 2,
        testCases: [
          { input: '3 -1 0 7 -5 2', expectedOutput: '3', isHidden: false },
          { input: '-4 -8', expectedOutput: '0', isHidden: false },
          { input: '1\n2\n3', expectedOutput: '3', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Funciones',
    xpReward: 10,
    contentMarkdown: md`
# Funciones

Una función agrupa instrucciones bajo un nombre para reutilizarlas. En C++ declaras el **tipo de cada parámetro** y el **tipo del valor que devuelve**.

## Anatomía

§§§cpp
int suma(int a, int b) {
return a + b;
}

int main() {
int resultado = suma(2, 3); // 5
cout << resultado << endl;
return 0;
}
§§§

- §int§ antes del nombre → el tipo del valor que devuelve.
- §(int a, int b)§ → los parámetros y su tipo.
- §return§ entrega el resultado y termina la función.

## El orden importa

C++ lee el archivo de arriba abajo: una función debe estar **declarada antes** de usarse. Si prefieres poner §main§ primero, escribe antes un **prototipo** (solo la firma):

§§§cpp
int suma(int a, int b); // prototipo

int main() {
cout << suma(2, 3) << endl;
return 0;
}

int suma(int a, int b) { // definición
return a + b;
}
§§§

## void

Si la función no devuelve nada, su tipo es §void§:

§§§cpp
void saludar(string nombre) {
cout << "Hola, " << nombre << endl;
}
§§§

## Imprimir un bool

§cout§ muestra los booleanos como §1§ o §0§. Con §boolalpha§ salen como §true§ o §false§:

§§§cpp
cout << boolalpha << (5 > 3) << endl; // true
§§§

## Valores por defecto

§§§cpp
int potencia(int base, int exponente = 2) {
int r = 1;
for (int i = 0; i < exponente; i++) r *= base;
return r;
}
// potencia(3) → 9 | potencia(2, 5) → 32
§§§

## Recuerda

- Los argumentos se **copian** al llamar la función (más sobre esto en la lección de referencias).
- Una función que hace **una sola cosa** y tiene un nombre claro (§esPar§, §esPrimo§) es más fácil de probar.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué tipo de valor devuelve esta función?',
        difficulty: 1,
        payload: {
          code: 'double promedio(int a, int b) {\n  return (a + b) / 2.0;\n}',
          options: ['int', 'double', 'void', 'bool'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'int doble(int n) {\n  return n * 2;\n}\n\nint main() {\n  cout << doble(doble(3));\n}',
          options: ['6', '12', '9', '3'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué ocurre al compilar este código?',
        difficulty: 2,
        payload: {
          code: 'int main() {\n  cout << suma(2, 3);\n}\n\nint suma(int a, int b) {\n  return a + b;\n}',
          options: [
            'Imprime 5',
            'Error: suma se usa antes de declararse',
            'Imprime 0',
            'Se ejecuta pero no imprime nada',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt:
          'Escribe la firma de una función que recibe un entero y devuelve un entero.',
        difficulty: 1,
        payload: {
          template: '{{0}} doble({{1}} n) {\n  return n * 2;\n}',
          blanks: ['int', 'int'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'int largo(string texto) {',
            '  return "largo: " + texto.length();',
            '}',
            'int main() { cout << largo("hola"); }',
          ],
          buggyLineIndex: 1,
          explanation:
            'La función promete devolver un int, pero "largo: " + ... intenta devolver un texto y ni siquiera suma bien.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: define una función, llámala e imprime el resultado.',
        difficulty: 2,
        payload: {
          blocks: [
            'int cuadrado(int n) {',
            '  return n * n;',
            '}',
            'int main() {',
            '  cout << cuadrado(6) << endl;',
            '}',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Completa la función `esPar` y úsala: lee un entero e imprime `true` si es par o `false` si no (con `boolalpha`).',
        starterCode: `${INCLUDES}bool esPar(int n) {\n  // TODO\n  return false;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << boolalpha << esPar(n) << endl;\n  return 0;\n}\n`,
        solution: `${INCLUDES}bool esPar(int n) {\n  return n % 2 == 0;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << boolalpha << esPar(n) << endl;\n  return 0;\n}\n`,
        difficulty: 1,
        testCases: [
          { input: '4', expectedOutput: 'true', isHidden: false },
          { input: '7', expectedOutput: 'false', isHidden: false },
          { input: '0', expectedOutput: 'true', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Escribe la función `potencia(base, exponente)` (enteros) y úsala: lee la base y el exponente e imprime el resultado.',
        starterCode: `${INCLUDES}long long potencia(int base, int exponente) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int base, exponente;\n  cin >> base >> exponente;\n  cout << potencia(base, exponente) << endl;\n  return 0;\n}\n`,
        solution: `${INCLUDES}long long potencia(int base, int exponente) {\n  long long resultado = 1;\n  for (int i = 0; i < exponente; i++) {\n    resultado *= base;\n  }\n  return resultado;\n}\n\nint main() {\n  int base, exponente;\n  cin >> base >> exponente;\n  cout << potencia(base, exponente) << endl;\n  return 0;\n}\n`,
        difficulty: 2,
        testCases: [
          { input: '2\n10', expectedOutput: '1024', isHidden: false },
          { input: '5 0', expectedOutput: '1', isHidden: false },
          { input: '3 4', expectedOutput: '81', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Escribe `esPrimo(n)` y úsala: lee un entero e imprime `primo` si lo es o `no primo` si no. El 1 no es primo.',
        starterCode: `${INCLUDES}bool esPrimo(int n) {\n  // TODO\n  return false;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << (esPrimo(n) ? "primo" : "no primo") << endl;\n  return 0;\n}\n`,
        solution: `${INCLUDES}bool esPrimo(int n) {\n  if (n < 2) {\n    return false;\n  }\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) {\n      return false;\n    }\n  }\n  return true;\n}\n\nint main() {\n  int n;\n  cin >> n;\n  cout << (esPrimo(n) ? "primo" : "no primo") << endl;\n  return 0;\n}\n`,
        difficulty: 3,
        testCases: [
          { input: '7', expectedOutput: 'primo', isHidden: false },
          { input: '9', expectedOutput: 'no primo', isHidden: false },
          { input: '1', expectedOutput: 'no primo', isHidden: true },
          { input: '97', expectedOutput: 'primo', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos enteros positivos e imprime su máximo común divisor, usando una función `mcd(a, b)` (algoritmo de Euclides).',
        starterCode: `${INCLUDES}int mcd(int a, int b) {\n  // TODO\n  return 0;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << mcd(a, b) << endl;\n  return 0;\n}\n`,
        solution: `${INCLUDES}int mcd(int a, int b) {\n  while (b != 0) {\n    int resto = a % b;\n    a = b;\n    b = resto;\n  }\n  return a;\n}\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << mcd(a, b) << endl;\n  return 0;\n}\n`,
        difficulty: 3,
        testCases: [
          { input: '12\n18', expectedOutput: '6', isHidden: false },
          { input: '17 5', expectedOutput: '1', isHidden: false },
          { input: '100 75', expectedOutput: '25', isHidden: true },
        ],
      },
    ],
  },
];
