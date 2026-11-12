import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Funciones y genéricos", lección 3.
export const funcionesParte2: SeedLesson[] = [
  {
    title: 'Genéricos',
    xpReward: 10,
    contentMarkdown: md`
# Genéricos

A veces quieres escribir una función que funcione con **cualquier tipo**, pero sin perder la información de qué tipo es. Para eso existen los **genéricos**.

## El problema

§§§typescript
function primero(lista: any[]): any {
return lista[0];
}

const n = primero([1, 2, 3]); // n es any: ya no hay protección
§§§

Con §any§ funciona, pero el compilador pierde el rastro: no sabe que §n§ es un número.

## Función genérica

Un **parámetro de tipo** (por convención §T§) es como una variable, pero para tipos:

§§§typescript
function primero<T>(lista: T[]): T {
return lista[0];
}

const a = primero([1, 2, 3]); // a: number
const b = primero(["x", "y"]); // b: string
§§§

- §<T>§ declara el parámetro de tipo.
- §T[]§ dice "un array de lo que sea §T§".
- El tipo de retorno §T§ asegura que lo que sale es del mismo tipo que lo que entró.

TypeScript **deduce** §T§ a partir de los argumentos; casi nunca tienes que escribirlo. También puedes indicarlo: §primero<number>([1, 2])§.

## Interfaces genéricas

§§§typescript
interface Caja<T> {
contenido: T;
}

const cajaNumero: Caja<number> = { contenido: 5 };
const cajaTexto: Caja<string> = { contenido: 5 };
// Error: number no es string
§§§

Ya usas genéricos sin saberlo: §Array<number>§ es lo mismo que §number[]§.

## Restricciones

§T extends algo§ limita qué tipos se aceptan:

§§§typescript
function largo<T extends { length: number }>(x: T): number {
return x.length;
}

largo("hola"); // 4
largo([1, 2, 3]); // 3
largo(5); // Error: number no tiene length
§§§

## Recuerda

- Un genérico mantiene la relación entre lo que entra y lo que sale.
- Es mejor que §any§: acepta cualquier tipo **y** conserva el tipo.
- Úsalo cuando la lógica no depende del tipo concreto (invertir un array, tomar el primero, envolver un valor…).
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué tipo deduce TypeScript para `a`?',
        difficulty: 1,
        payload: {
          code: 'function primero<T>(lista: T[]): T {\n  return lista[0];\n}\nconst a = primero([1, 2, 3]);',
          options: ['any', 'number', 'number[]', 'T'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con la última línea?',
        difficulty: 2,
        payload: {
          code: 'interface Caja<T> {\n  contenido: T;\n}\nconst c: Caja<string> = { contenido: 5 };',
          options: [
            'Funciona',
            'Marca un error: 5 no es un string',
            'Convierte 5 en "5"',
            'T se vuelve number',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Por qué un genérico es mejor que `any` aquí?',
        difficulty: 2,
        payload: {
          code: 'function identidad<T>(x: T): T {\n  return x;\n}',
          options: [
            'Porque es más corto',
            'Porque conserva el tipo: lo que entra y lo que sale es el mismo',
            'Porque acepta menos tipos',
            'Porque es más rápido al ejecutarse',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara la función con un parámetro de tipo `T`.',
        difficulty: 1,
        payload: {
          template: 'function identidad{{0}}(x: T): T {\n  return x;\n}',
          blanks: ['<T>'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 3,
        payload: {
          lines: [
            'function largo<T extends { length: number }>(x: T): number {',
            '  return x.length;',
            '}',
            'console.log(largo("hola"));',
            'console.log(largo(5));',
          ],
          buggyLineIndex: 4,
          explanation:
            'T debe tener una propiedad length; un number no la tiene.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas de la función genérica que devuelve el último elemento.',
        difficulty: 2,
        payload: {
          blocks: [
            'function ultimo<T>(lista: T[]): T {',
            '  return lista[lista.length - 1];',
            '}',
            'console.log(ultimo([1, 2, 3]));',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de palabras separadas por espacio. Usa la función genérica `ultimo` para imprimir la última.',
        starterCode: `${ENTRADA}function ultimo<T>(lista: T[]): T {\n  // TODO\n}\n\nconst palabras: string[] = lineas[0].split(' ');\nconsole.log(ultimo(palabras));\n`,
        solution: `${ENTRADA}function ultimo<T>(lista: T[]): T {\n  return lista[lista.length - 1];\n}\n\nconst palabras: string[] = lineas[0].split(' ');\nconsole.log(ultimo(palabras));\n`,
        difficulty: 1,
        testCases: [
          { input: 'uno dos tres', expectedOutput: 'tres', isHidden: false },
          { input: 'solo', expectedOutput: 'solo', isHidden: false },
          { input: 'a b', expectedOutput: 'b', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de palabras e imprímelas en orden inverso, separadas por espacio, con una función genérica `invertir`.',
        starterCode: `${ENTRADA}function invertir<T>(lista: T[]): T[] {\n  // TODO\n}\n\nconst palabras: string[] = lineas[0].split(' ');\nconsole.log(invertir(palabras).join(' '));\n`,
        solution: `${ENTRADA}function invertir<T>(lista: T[]): T[] {\n  const resultado: T[] = [];\n  for (let i: number = lista.length - 1; i >= 0; i--) {\n    resultado.push(lista[i]);\n  }\n  return resultado;\n}\n\nconst palabras: string[] = lineas[0].split(' ');\nconsole.log(invertir(palabras).join(' '));\n`,
        difficulty: 2,
        testCases: [
          {
            input: 'uno dos tres',
            expectedOutput: 'tres dos uno',
            isHidden: false,
          },
          { input: 'a', expectedOutput: 'a', isHidden: false },
          { input: 'x y z w', expectedOutput: 'w z y x', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de números y un número buscado (línea 2). Imprime cuántas veces aparece, usando la función genérica `contar`.',
        starterCode: `${ENTRADA}function contar<T>(lista: T[], buscado: T): number {\n  // TODO\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconsole.log(contar(numeros, Number(lineas[1])));\n`,
        solution: `${ENTRADA}function contar<T>(lista: T[], buscado: T): number {\n  let veces: number = 0;\n  for (const x of lista) {\n    if (x === buscado) {\n      veces++;\n    }\n  }\n  return veces;\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconsole.log(contar(numeros, Number(lineas[1])));\n`,
        difficulty: 3,
        testCases: [
          { input: '1 2 2 3 2\n2', expectedOutput: '3', isHidden: false },
          { input: '5 5 5\n7', expectedOutput: '0', isHidden: false },
          { input: '9\n9', expectedOutput: '1', isHidden: true },
        ],
      },
    ],
  },
];
