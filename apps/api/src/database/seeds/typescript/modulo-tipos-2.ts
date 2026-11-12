import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Tipos en profundidad", lecciones 3-4.
export const tiposParte2: SeedLesson[] = [
  {
    title: 'Tuplas y enums',
    xpReward: 10,
    contentMarkdown: md`
# Tuplas y enums

## Tuplas

Una **tupla** es un array con una cantidad fija de elementos y un tipo para **cada posición**:

§§§typescript
let persona: [string, number] = ["Ana", 20];

persona[0]; // "Ana" (string)
persona[1]; // 20 (number)
persona = [20, "Ana"]; // Error: el orden de los tipos importa
§§§

Son útiles para devolver dos valores a la vez:

§§§typescript
function minMax(nums: number[]): [number, number] {
return [Math.min(...nums), Math.max(...nums)];
}

const [minimo, maximo] = minMax([4, 9, 1]); // 1 y 9
§§§

La línea §const [minimo, maximo] = ...§ se llama **desestructuración**: saca cada posición a su propia variable.

## Enums

Un **enum** da nombre a un conjunto de constantes relacionadas:

§§§typescript
enum Dia {
Lunes,
Martes,
Miercoles,
}

const hoy: Dia = Dia.Martes;
console.log(hoy); // 1 (los números empiezan en 0)
console.log(Dia[1]); // "Martes"
§§§

También pueden tener valores de texto, más fáciles de leer al imprimirlos:

§§§typescript
enum Estado {
Activo = "ACTIVO",
Inactivo = "INACTIVO",
}

console.log(Estado.Activo); // "ACTIVO"
§§§

## Enum o unión de literales

Para pocas opciones de texto, una unión de literales (§"activo" | "inactivo"§) suele ser más simple. Los enums sirven cuando quieres agrupar constantes con nombre y, a veces, con números asociados.

## Recuerda

- Tupla: tamaño y tipos fijos por posición.
- Enum: constantes con nombre; sin valor explícito, numeran desde 0.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con la segunda línea?',
        difficulty: 1,
        payload: {
          code: 'let persona: [string, number] = ["Ana", 20];\npersona = [20, "Ana"];',
          options: [
            'Funciona: el orden no importa',
            'Marca un error: el orden de los tipos no coincide',
            'Convierte los valores',
            'Marca un error en la primera línea',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'enum Dia {\n  Lunes,\n  Martes,\n  Miercoles,\n}\nconsole.log(Dia.Miercoles);',
          options: ['"Miercoles"', '2', '3', 'undefined'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'enum Estado {\n  Activo = "ACTIVO",\n  Inactivo = "INACTIVO",\n}\nconsole.log(Estado.Inactivo);',
          options: ['1', '"Inactivo"', 'INACTIVO', 'undefined'],
          correctIndex: 2,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara una tupla con un texto y un número.',
        difficulty: 1,
        payload: {
          template: 'const par: [{{0}}, {{1}}] = ["edad", 20];',
          blanks: ['string', 'number'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'const punto: [number, number] = [3, 4];',
            'const x: number = punto[0];',
            'const nombre: string = punto[1];',
            'console.log(x, nombre);',
          ],
          buggyLineIndex: 2,
          explanation:
            'punto[1] es un number, no se puede guardar en una variable de tipo string.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: define el enum, elige un valor e imprímelo.',
        difficulty: 2,
        payload: {
          blocks: [
            'enum Color {',
            '  Rojo,',
            '  Verde,',
            '}',
            'const c: Color = Color.Verde;',
            'console.log(c);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de números separados por espacios. Imprime el mínimo y el máximo separados por un espacio, usando una función que devuelve una tupla.',
        starterCode: `${ENTRADA}function minMax(nums: number[]): [number, number] {\n  // TODO\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\n`,
        solution: `${ENTRADA}function minMax(nums: number[]): [number, number] {\n  let minimo: number = nums[0];\n  let maximo: number = nums[0];\n  for (const n of nums) {\n    if (n < minimo) {\n      minimo = n;\n    }\n    if (n > maximo) {\n      maximo = n;\n    }\n  }\n  return [minimo, maximo];\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconst [minimo, maximo] = minMax(numeros);\nconsole.log(\`\${minimo} \${maximo}\`);\n`,
        difficulty: 2,
        testCases: [
          { input: '4 9 1', expectedOutput: '1 9', isHidden: false },
          { input: '-3 -8 0', expectedOutput: '-8 0', isHidden: false },
          { input: '5', expectedOutput: '5 5', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un número del 0 al 2 e imprime el nombre del nivel usando el enum: 0 → `FACIL`, 1 → `MEDIO`, 2 → `DIFICIL`.',
        starterCode: `${ENTRADA}enum Nivel {\n  Facil = "FACIL",\n  Medio = "MEDIO",\n  Dificil = "DIFICIL",\n}\n\nfunction nombreNivel(n: number): Nivel {\n  // TODO\n}\n\nconsole.log(nombreNivel(Number(lineas[0])));\n`,
        solution: `${ENTRADA}enum Nivel {\n  Facil = "FACIL",\n  Medio = "MEDIO",\n  Dificil = "DIFICIL",\n}\n\nfunction nombreNivel(n: number): Nivel {\n  if (n === 0) {\n    return Nivel.Facil;\n  }\n  if (n === 1) {\n    return Nivel.Medio;\n  }\n  return Nivel.Dificil;\n}\n\nconsole.log(nombreNivel(Number(lineas[0])));\n`,
        difficulty: 2,
        testCases: [
          { input: '0', expectedOutput: 'FACIL', isHidden: false },
          { input: '1', expectedOutput: 'MEDIO', isHidden: false },
          { input: '2', expectedOutput: 'DIFICIL', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Estrechar tipos',
    xpReward: 10,
    contentMarkdown: md`
# Estrechar tipos

Cuando una variable puede tener varios tipos (una unión), solo puedes usar lo que **todos** los tipos tienen en común. Para usar algo propio de un tipo, primero hay que **comprobar** cuál es. A eso se le llama **estrechar** (_narrowing_).

## El problema

§§§typescript
function mostrar(valor: number | string): string {
return valor.toFixed(2);
// Error: Property 'toFixed' does not exist on type 'string | number'.
}
§§§

§toFixed§ existe en los números pero no en los textos, y el compilador no sabe cuál te llegará.

## typeof

§§§typescript
function mostrar(valor: number | string): string {
if (typeof valor === "number") {
return valor.toFixed(2); // aquí valor es number
}
return valor.toUpperCase(); // aquí valor es string
}
§§§

Dentro del §if§, TypeScript **sabe** que §valor§ es un §number§, y fuera, que es un §string§. Los valores posibles de §typeof§ son §"string"§, §"number"§, §"boolean"§, §"undefined"§, §"object"§ y §"function"§.

## in

Comprueba si un objeto tiene una propiedad, útil con uniones de objetos:

§§§typescript
interface Circulo { radio: number }
interface Rectangulo { ancho: number; alto: number }

function area(figura: Circulo | Rectangulo): number {
if ("radio" in figura) {
return Math.PI * figura.radio * figura.radio;
}
return figura.ancho * figura.alto;
}
§§§

## Otras comprobaciones

- §Array.isArray(x)§ distingue un array de otros valores.
- §x instanceof Clase§ comprueba si un objeto viene de una clase.
- Una comparación con un literal (§estado === "activo"§) también estrecha una unión de literales.

## Recuerda

Estrechar es "demostrarle" al compilador qué tipo tienes en cada punto del programa. Cuanto más claras sean tus comprobaciones, menos errores en tiempo de ejecución.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Por qué el compilador marca un error?',
        difficulty: 2,
        payload: {
          code: 'function mostrar(valor: number | string): string {\n  return valor.toFixed(2);\n}',
          options: [
            'toFixed no existe en ningún tipo',
            'toFixed solo existe en number y valor podría ser un string',
            'Falta el return',
            'La función debería devolver number',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué tipo tiene `valor` dentro del `if`?',
        difficulty: 2,
        payload: {
          code: 'function f(valor: number | string) {\n  if (typeof valor === "string") {\n    // ¿tipo de valor aquí?\n  }\n}',
          options: ['number', 'string', 'number | string', 'any'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'function f(x: number | string): string {\n  if (typeof x === "number") {\n    return "N" + (x * 2);\n  }\n  return "S" + x.length;\n}\nconsole.log(f(5), f("hola"));',
          options: ['N10 S4', 'N5 S4', 'N10 S5', 'S10 N4'],
          correctIndex: 0,
        },
      },
      {
        type: 'fill',
        prompt: 'Completa la comprobación para saber si `valor` es un número.',
        difficulty: 1,
        payload: {
          template: 'if ({{0}} valor === "{{1}}") {\n  return valor * 2;\n}',
          blanks: ['typeof', 'number'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 3,
        payload: {
          lines: [
            'function largo(x: number | string): number {',
            '  if (typeof x === "string") {',
            '    return x.length;',
            '  }',
            '  return x.length;',
            '}',
          ],
          buggyLineIndex: 4,
          explanation:
            'Fuera del if, x es un number, y los números no tienen length. Habría que devolver otra cosa (por ejemplo, el propio número).',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas de la función que duplica números y pone los textos en mayúsculas.',
        difficulty: 3,
        payload: {
          blocks: [
            'function tratar(x: number | string): number | string {',
            '  if (typeof x === "number") {',
            '    return x * 2;',
            '  }',
            '  return x.toUpperCase();',
            '}',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un valor. Si es un número (por ejemplo `21`), imprime su doble; si es un texto, imprímelo en mayúsculas.',
        starterCode: `${ENTRADA}function tratar(x: number | string): string {\n  // TODO\n}\n\nconst entrada: string = lineas[0];\nconst valor: number | string = isNaN(Number(entrada)) ? entrada : Number(entrada);\nconsole.log(tratar(valor));\n`,
        solution: `${ENTRADA}function tratar(x: number | string): string {\n  if (typeof x === "number") {\n    return String(x * 2);\n  }\n  return x.toUpperCase();\n}\n\nconst entrada: string = lineas[0];\nconst valor: number | string = isNaN(Number(entrada)) ? entrada : Number(entrada);\nconsole.log(tratar(valor));\n`,
        difficulty: 2,
        testCases: [
          { input: '21', expectedOutput: '42', isHidden: false },
          { input: 'hola', expectedOutput: 'HOLA', isHidden: false },
          { input: '-5', expectedOutput: '-10', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una figura: `circulo <radio>` o `rectangulo <ancho> <alto>`. Imprime su área con 2 decimales.',
        starterCode: `${ENTRADA}interface Circulo {\n  radio: number;\n}\ninterface Rectangulo {\n  ancho: number;\n  alto: number;\n}\n\nfunction area(figura: Circulo | Rectangulo): number {\n  // TODO\n}\n\nconst partes: string[] = lineas[0].split(' ');\nconst figura: Circulo | Rectangulo =\n  partes[0] === 'circulo'\n    ? { radio: Number(partes[1]) }\n    : { ancho: Number(partes[1]), alto: Number(partes[2]) };\nconsole.log(area(figura).toFixed(2));\n`,
        solution: `${ENTRADA}interface Circulo {\n  radio: number;\n}\ninterface Rectangulo {\n  ancho: number;\n  alto: number;\n}\n\nfunction area(figura: Circulo | Rectangulo): number {\n  if ('radio' in figura) {\n    return Math.PI * figura.radio * figura.radio;\n  }\n  return figura.ancho * figura.alto;\n}\n\nconst partes: string[] = lineas[0].split(' ');\nconst figura: Circulo | Rectangulo =\n  partes[0] === 'circulo'\n    ? { radio: Number(partes[1]) }\n    : { ancho: Number(partes[1]), alto: Number(partes[2]) };\nconsole.log(area(figura).toFixed(2));\n`,
        difficulty: 3,
        testCases: [
          { input: 'circulo 2', expectedOutput: '12.57', isHidden: false },
          { input: 'rectangulo 3 4', expectedOutput: '12.00', isHidden: false },
          { input: 'circulo 1', expectedOutput: '3.14', isHidden: true },
        ],
      },
    ],
  },
];
