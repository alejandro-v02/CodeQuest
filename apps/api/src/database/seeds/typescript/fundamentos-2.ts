import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Fundamentos, lecciones 4-5.
export const fundamentosParte2: SeedLesson[] = [
  {
    title: 'Bucles',
    xpReward: 10,
    contentMarkdown: md`
# Bucles

Un bucle repite un bloque de código mientras se cumpla una condición. Así evitas copiar y pegar la misma instrucción.

## for

§§§typescript
for (let i: number = 1; i <= 3; i++) {
console.log(i);
}
// 1, 2, 3
§§§

Tiene tres partes: **inicio** (§let i = 1§), **condición** (§i <= 3§) y **paso** (§i++§, que suma 1 a §i§ en cada vuelta).

## while

Repite mientras la condición sea verdadera. Úsalo cuando no sabes cuántas vueltas habrá.

§§§typescript
let n: number = 100;
let pasos: number = 0;
while (n > 1) {
n = Math.floor(n / 2);
pasos++;
}
§§§

Cuidado con los bucles infinitos: algo dentro debe acercar la condición a falsa.

## for...of

Recorre los elementos de un array:

§§§typescript
const nombres: string[] = ["Ana", "Luis"];
for (const nombre of nombres) {
console.log(nombre);
}
§§§

## break y continue

- §break§ sale del bucle de inmediato.
- §continue§ salta a la siguiente vuelta.

## Acumuladores

Un patrón muy común: una variable que va juntando un resultado.

§§§typescript
let suma: number = 0;
for (let i: number = 1; i <= 5; i++) {
suma += i;
}
// suma = 15
§§§

El compilador te protege: si declaras §suma§ como §number§ no podrás meterle un texto por accidente dentro del bucle.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'for (let i: number = 0; i < 3; i++) {\n  console.log(i);\n}',
          options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Cuántas vueltas da este bucle?',
        difficulty: 2,
        payload: {
          code: 'let i: number = 0;\nwhile (i < 5) {\n  i += 2;\n}',
          options: ['2', '3', '4', '5'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa el bucle para contar de 1 a 5.',
        difficulty: 1,
        payload: {
          template:
            'for (let i: number = {{0}}; i <= 5; i{{1}}) {\n  console.log(i);\n}',
          blanks: ['1', '++'],
        },
      },
      {
        type: 'bug',
        prompt: 'Este bucle nunca termina. ¿Qué línea tiene el error?',
        difficulty: 2,
        payload: {
          lines: [
            'let suma: number = 0;',
            'for (let i: number = 1; i <= 5; i--) {',
            '  suma += i;',
            '}',
            'console.log(suma);',
          ],
          buggyLineIndex: 1,
          explanation:
            'i empieza en 1 y baja con i--, así que nunca llega a ser mayor que 5. Debe subir con i++.',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas que suman los números del 1 al 4.',
        difficulty: 2,
        payload: {
          blocks: [
            'let suma: number = 0;',
            'for (let i: number = 1; i <= 4; i++) {',
            '  suma += i;',
            '}',
            'console.log(suma);',
          ],
        },
      },
      {
        type: 'code',
        prompt: 'Lee un número N e imprime la suma de los enteros de 1 a N.',
        starterCode: `${ENTRADA}const n: number = Number(lineas[0]);\nlet suma: number = 0;\n`,
        solution: `${ENTRADA}const n: number = Number(lineas[0]);\nlet suma: number = 0;\nfor (let i: number = 1; i <= n; i++) {\n  suma += i;\n}\nconsole.log(suma);\n`,
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
          'Lee un número N e imprime los números de 1 a N, uno por línea.',
        starterCode: `${ENTRADA}const n: number = Number(lineas[0]);\n`,
        solution: `${ENTRADA}const n: number = Number(lineas[0]);\nfor (let i: number = 1; i <= n; i++) {\n  console.log(i);\n}\n`,
        difficulty: 1,
        testCases: [
          { input: '3', expectedOutput: '1\n2\n3', isHidden: false },
          { input: '1', expectedOutput: '1', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un número N e imprime su factorial (N! = 1 × 2 × … × N). El factorial de 0 es 1.',
        starterCode: `${ENTRADA}const n: number = Number(lineas[0]);\nlet resultado: number = 1;\n`,
        solution: `${ENTRADA}const n: number = Number(lineas[0]);\nlet resultado: number = 1;\nfor (let i: number = 2; i <= n; i++) {\n  resultado *= i;\n}\nconsole.log(resultado);\n`,
        difficulty: 2,
        testCases: [
          { input: '5', expectedOutput: '120', isHidden: false },
          { input: '0', expectedOutput: '1', isHidden: false },
          { input: '10', expectedOutput: '3628800', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Funciones tipadas',
    xpReward: 10,
    contentMarkdown: md`
# Funciones tipadas

Una función agrupa instrucciones bajo un nombre para reutilizarlas. En TypeScript anotas los tipos de **cada parámetro** y del **valor que devuelve**.

## Anatomía

§§§typescript
function suma(a: number, b: number): number {
return a + b;
}

const resultado: number = suma(2, 3); // 5
§§§

- §a: number, b: number§ → los parámetros y su tipo.
- §: number§ después de los paréntesis → el tipo del valor que devuelve.
- §return§ entrega el resultado y termina la función.

## El compilador revisa las llamadas

§§§typescript
suma("2", 3); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
suma(2); // Error: Expected 2 arguments, but got 1.
§§§

En JavaScript estas llamadas "funcionarían" y darían resultados raros (§"23"§ o §NaN§). Aquí el error aparece antes de ejecutar.

## void

Si una función no devuelve nada, su tipo de retorno es §void§:

§§§typescript
function saludar(nombre: string): void {
console.log(\`Hola, \${nombre}\`);
}
§§§

## El retorno también se comprueba

§§§typescript
function largo(texto: string): number {
return "largo: " + texto.length; // Error: string no es number
}
§§§

## Funciones flecha

§§§typescript
const doble = (n: number): number => n * 2;
§§§

## Consejo

Una función pequeña que hace **una sola cosa** y tiene tipos claros es más fácil de probar y de entender. Intenta que el nombre diga qué hace: §esPar§, §promedio§, §contarVocales§.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué tipo de valor devuelve esta función?',
        difficulty: 1,
        payload: {
          code: 'function saludar(nombre: string): string {\n  return "Hola " + nombre;\n}',
          options: ['number', 'string', 'void', 'boolean'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: 'Con esta función, ¿qué hace el compilador con `suma("1", 2)`?',
        difficulty: 2,
        payload: {
          code: 'function suma(a: number, b: number): number {\n  return a + b;\n}\nsuma("1", 2);',
          options: [
            'Devuelve "12"',
            'Devuelve 3',
            'Marca un error: "1" no es un number',
            'Devuelve NaN',
          ],
          correctIndex: 2,
        },
      },
      {
        type: 'fill',
        prompt:
          'Anota los tipos de la función: recibe un número y devuelve un número.',
        difficulty: 1,
        payload: {
          template:
            'function doble(n{{0}} number){{1}} number {\n  return n * 2;\n}',
          blanks: [':', ':'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'function largo(texto: string): number {',
            '  return "largo: " + texto.length;',
            '}',
            'console.log(largo("hola"));',
          ],
          buggyLineIndex: 1,
          explanation:
            'La función promete devolver un number, pero "largo: " + ... produce un string.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: define una función, guarda su resultado e imprímelo.',
        difficulty: 2,
        payload: {
          blocks: [
            'function cuadrado(n: number): number {',
            '  return n * n;',
            '}',
            'const r: number = cuadrado(6);',
            'console.log(r);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Completa la función `esPar` y úsala: lee un número e imprime `true` si es par o `false` si no.',
        starterCode: `${ENTRADA}function esPar(n: number): boolean {\n  // TODO\n}\n\nconst n: number = Number(lineas[0]);\n`,
        solution: `${ENTRADA}function esPar(n: number): boolean {\n  return n % 2 === 0;\n}\n\nconst n: number = Number(lineas[0]);\nconsole.log(esPar(n));\n`,
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
          'Escribe la función `promedio(a, b)` y usa para leer dos números e imprimir su promedio con 2 decimales.',
        starterCode: `${ENTRADA}function promedio(a: number, b: number): number {\n  // TODO\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\n`,
        solution: `${ENTRADA}function promedio(a: number, b: number): number {\n  return (a + b) / 2;\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconsole.log(promedio(a, b).toFixed(2));\n`,
        difficulty: 2,
        testCases: [
          { input: '4\n5', expectedOutput: '4.50', isHidden: false },
          { input: '10\n10', expectedOutput: '10.00', isHidden: false },
          { input: '1\n2', expectedOutput: '1.50', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Escribe `contarVocales(texto)`, que devuelve cuántas vocales (a, e, i, o, u) tiene el texto sin importar mayúsculas. Lee un texto e imprime el resultado.',
        starterCode: `${ENTRADA}function contarVocales(texto: string): number {\n  // TODO\n}\n\nconsole.log(contarVocales(lineas[0]));\n`,
        solution: `${ENTRADA}function contarVocales(texto: string): number {\n  let total: number = 0;\n  for (const letra of texto.toLowerCase()) {\n    if ("aeiou".indexOf(letra) !== -1) {\n      total++;\n    }\n  }\n  return total;\n}\n\nconsole.log(contarVocales(lineas[0]));\n`,
        difficulty: 3,
        testCases: [
          { input: 'murcielago', expectedOutput: '5', isHidden: false },
          { input: 'TypeScript', expectedOutput: '2', isHidden: false },
          { input: 'rhythm', expectedOutput: '0', isHidden: true },
        ],
      },
    ],
  },
];
