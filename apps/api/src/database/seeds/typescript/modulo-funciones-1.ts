import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Funciones y genéricos", lecciones 1-2.
export const funcionesParte1: SeedLesson[] = [
  {
    title: 'Parámetros opcionales y por defecto',
    xpReward: 10,
    contentMarkdown: md`
# Parámetros opcionales y por defecto

Por defecto, TypeScript exige **todos** los argumentos de una función. Hay tres formas de relajarlo.

## Parámetro opcional (?)

Con §?§ después del nombre, el argumento puede omitirse. Si se omite, vale §undefined§.

§§§typescript
function saludar(nombre: string, titulo?: string): string {
if (titulo) {
return \`Hola, \${titulo} \${nombre}\`;
}
return \`Hola, \${nombre}\`;
}

saludar("Ana"); // "Hola, Ana"
saludar("Ana", "Dra."); // "Hola, Dra. Ana"
§§§

Los parámetros opcionales deben ir **después** de los obligatorios:

§§§typescript
function f(a?: number, b: number) {}
// Error: A required parameter cannot follow an optional parameter.
§§§

## Valor por defecto

Si das un valor con §=§, el parámetro se vuelve opcional y toma ese valor al omitirse. El tipo se deduce solo, pero puedes anotarlo.

§§§typescript
function potencia(base: number, exponente: number = 2): number {
return Math.pow(base, exponente);
}

potencia(3); // 9 (exponente = 2)
potencia(2, 5); // 32
§§§

## Parámetros rest (...)

Reúnen **todos los argumentos restantes** en un array:

§§§typescript
function sumar(...numeros: number[]): number {
let total: number = 0;
for (const n of numeros) {
total += n;
}
return total;
}

sumar(1, 2, 3); // 6
sumar(); // 0
§§§

Un parámetro rest va siempre al final y su tipo es un array.

## Cuándo usar cada uno

- **Opcional (?)**: cuando "no dar nada" tiene sentido y tú decides qué hacer.
- **Por defecto**: cuando existe un valor razonable de partida.
- **Rest**: cuando la cantidad de argumentos es variable.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con estas llamadas?',
        difficulty: 1,
        payload: {
          code: 'function saludar(nombre: string, titulo?: string): string {\n  return nombre;\n}\nsaludar("Ana");\nsaludar();',
          options: [
            'Las dos son válidas',
            'Solo saludar("Ana") es válida; saludar() marca un error',
            'Las dos marcan un error',
            'Solo saludar() es válida',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'function potencia(base: number, exp: number = 2): number {\n  return Math.pow(base, exp);\n}\nconsole.log(potencia(3));',
          options: ['3', '6', '9', 'NaN'],
          correctIndex: 2,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'function sumar(...n: number[]): number {\n  let t: number = 0;\n  for (const x of n) {\n    t += x;\n  }\n  return t;\n}\nconsole.log(sumar(1, 2, 3), sumar());',
          options: ['6 0', '6 undefined', '3 0', '6 NaN'],
          correctIndex: 0,
        },
      },
      {
        type: 'fill',
        prompt: 'Haz que `titulo` sea un parámetro opcional.',
        difficulty: 1,
        payload: {
          template:
            'function saludar(nombre: string, titulo{{0}}: string): string {\n  return nombre;\n}',
          blanks: ['?'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error en la declaración. ¿Qué línea?',
        difficulty: 2,
        payload: {
          lines: [
            'function crear(',
            '  descripcion?: string,',
            '  id: number',
            '): string {',
            '  return String(id);',
            '}',
          ],
          buggyLineIndex: 2,
          explanation:
            'Un parámetro obligatorio (id) no puede ir después de uno opcional (descripcion?).',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas de la función con exponente por defecto.',
        difficulty: 2,
        payload: {
          blocks: [
            'function potencia(base: number, exp: number = 2): number {',
            '  return Math.pow(base, exp);',
            '}',
            'console.log(potencia(4));',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee una base (línea 1) y, si existe, un exponente (línea 2). Imprime la potencia: si no hay exponente, usa 2.',
        starterCode: `${ENTRADA}function potencia(base: number, exponente: number = 2): number {\n  // TODO\n}\n\nconst base: number = Number(lineas[0]);\nconst exp: number | undefined = lineas.length > 1 ? Number(lineas[1]) : undefined;\nconsole.log(potencia(base, exp));\n`,
        solution: `${ENTRADA}function potencia(base: number, exponente: number = 2): number {\n  return Math.pow(base, exponente);\n}\n\nconst base: number = Number(lineas[0]);\nconst exp: number | undefined = lineas.length > 1 ? Number(lineas[1]) : undefined;\nconsole.log(potencia(base, exp));\n`,
        difficulty: 2,
        testCases: [
          { input: '3', expectedOutput: '9', isHidden: false },
          { input: '2\n5', expectedOutput: '32', isHidden: false },
          { input: '10\n0', expectedOutput: '1', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de números separados por espacio. Usa la función `sumar(...numeros)` para imprimir su suma.',
        starterCode: `${ENTRADA}function sumar(...numeros: number[]): number {\n  // TODO\n}\n\nconst datos: number[] = lineas[0].split(' ').map(Number);\nconsole.log(sumar(...datos));\n`,
        solution: `${ENTRADA}function sumar(...numeros: number[]): number {\n  let total: number = 0;\n  for (const n of numeros) {\n    total += n;\n  }\n  return total;\n}\n\nconst datos: number[] = lineas[0].split(' ').map(Number);\nconsole.log(sumar(...datos));\n`,
        difficulty: 2,
        testCases: [
          { input: '1 2 3', expectedOutput: '6', isHidden: false },
          { input: '10 20', expectedOutput: '30', isHidden: false },
          { input: '7', expectedOutput: '7', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (línea 1) y, si existe, un título (línea 2). Imprime `Hola, <titulo> <nombre>` o `Hola, <nombre>` si no hay título.',
        starterCode: `${ENTRADA}function saludar(nombre: string, titulo?: string): string {\n  // TODO\n}\n\nconsole.log(saludar(lineas[0], lineas[1]));\n`,
        solution: `${ENTRADA}function saludar(nombre: string, titulo?: string): string {\n  if (titulo) {\n    return \`Hola, \${titulo} \${nombre}\`;\n  }\n  return \`Hola, \${nombre}\`;\n}\n\nconsole.log(saludar(lineas[0], lineas[1]));\n`,
        difficulty: 2,
        testCases: [
          { input: 'Ana', expectedOutput: 'Hola, Ana', isHidden: false },
          {
            input: 'Ana\nDra.',
            expectedOutput: 'Hola, Dra. Ana',
            isHidden: false,
          },
          {
            input: 'Luis\nIng.',
            expectedOutput: 'Hola, Ing. Luis',
            isHidden: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Funciones flecha y callbacks tipados',
    xpReward: 10,
    contentMarkdown: md`
# Funciones flecha y callbacks tipados

En TypeScript las funciones son valores: puedes guardarlas en variables, pasarlas a otras funciones y devolverlas. Solo hay que tipar bien lo que reciben y devuelven.

## Funciones flecha

§§§typescript
const doble = (n: number): number => n * 2;
const saludar = (nombre: string): string => \`Hola, \${nombre}\`;
§§§

## Tipos de funciones

Un tipo de función se escribe con una flecha: **parámetros → resultado**.

§§§typescript
let operacion: (a: number, b: number) => number;

operacion = (a, b) => a + b; // válido
operacion = (a, b) => "x"; // Error: devuelve string
§§§

## Callbacks

Un **callback** es una función que se pasa a otra para que la use.

§§§typescript
function aplicar(numeros: number[], f: (n: number) => number): number[] {
const resultado: number[] = [];
for (const n of numeros) {
resultado.push(f(n));
}
return resultado;
}

aplicar([1, 2, 3], (n: number) => n * 10); // [10, 20, 30]
§§§

El parámetro §f§ tiene el tipo §(n: number) => number§: el compilador exige que lo que pases reciba un número y devuelva un número.

## map, filter y reduce con tipos

§§§typescript
const nums: number[] = [1, 2, 3, 4];
const textos: string[] = nums.map((n: number): string => "n" + n);
const pares: number[] = nums.filter((n: number): boolean => n % 2 === 0);
§§§

Si el resultado no coincide con el tipo de la variable, el compilador avisa:

§§§typescript
const x: number[] = nums.map((n: number) => "n" + n);
// Error: string[] no se puede asignar a number[]
§§§

## Funciones que devuelven funciones

§§§typescript
function multiplicador(factor: number): (n: number) => number {
return (n: number): number => n * factor;
}

const triple = multiplicador(3);
triple(5); // 15
§§§
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué significa el tipo de `f`?',
        difficulty: 1,
        payload: {
          code: 'function aplicar(f: (n: number) => number) {}',
          options: [
            'f es un número',
            'f es una función que recibe un number y devuelve un number',
            'f es un array de números',
            'f no recibe parámetros',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con esta línea?',
        difficulty: 2,
        payload: {
          code: 'const nums: number[] = [1, 2];\nconst x: number[] = nums.map((n: number) => "n" + n);',
          options: [
            'Funciona y x = ["n1", "n2"]',
            'Marca un error: string[] no es number[]',
            'x queda vacío',
            'Convierte los textos a números',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'function multiplicador(f: number): (n: number) => number {\n  return (n: number): number => n * f;\n}\nconst triple = multiplicador(3);\nconsole.log(triple(5));',
          options: ['8', '15', '35', 'undefined'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Anota que la función flecha devuelve un número.',
        difficulty: 1,
        payload: {
          template: 'const doble = (n: number){{0}} number {{1}} n * 2;',
          blanks: [':', '=>'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'let operacion: (a: number, b: number) => number;',
            'operacion = (a, b) => a + b;',
            'operacion = (a, b) => "resultado";',
            'console.log(operacion(1, 2));',
          ],
          buggyLineIndex: 2,
          explanation:
            'operacion debe devolver un number, pero esa función devuelve un string.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: función que aplica un callback a un número.',
        difficulty: 2,
        payload: {
          blocks: [
            'function aplicar(n: number, f: (x: number) => number): number {',
            '  return f(n);',
            '}',
            'console.log(aplicar(4, (x: number) => x * x));',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de números (separados por espacio) y una operación (`doble` o `cuadrado`). Imprime el resultado de aplicarla a cada número, separado por espacios.',
        starterCode: `${ENTRADA}function aplicar(numeros: number[], f: (n: number) => number): number[] {\n  // TODO\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconst doble = (n: number): number => n * 2;\nconst cuadrado = (n: number): number => n * n;\nconst f = lineas[1] === 'doble' ? doble : cuadrado;\nconsole.log(aplicar(numeros, f).join(' '));\n`,
        solution: `${ENTRADA}function aplicar(numeros: number[], f: (n: number) => number): number[] {\n  const resultado: number[] = [];\n  for (const n of numeros) {\n    resultado.push(f(n));\n  }\n  return resultado;\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconst doble = (n: number): number => n * 2;\nconst cuadrado = (n: number): number => n * n;\nconst f = lineas[1] === 'doble' ? doble : cuadrado;\nconsole.log(aplicar(numeros, f).join(' '));\n`,
        difficulty: 2,
        testCases: [
          { input: '1 2 3\ndoble', expectedOutput: '2 4 6', isHidden: false },
          {
            input: '1 2 3\ncuadrado',
            expectedOutput: '1 4 9',
            isHidden: false,
          },
          { input: '5\ncuadrado', expectedOutput: '25', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea de números y un umbral (línea 2). Imprime los números mayores que el umbral, separados por espacios, en el mismo orden.',
        starterCode: `${ENTRADA}function filtrar(numeros: number[], condicion: (n: number) => boolean): number[] {\n  // TODO\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconst umbral: number = Number(lineas[1]);\nconsole.log(filtrar(numeros, (n: number) => n > umbral).join(' '));\n`,
        solution: `${ENTRADA}function filtrar(numeros: number[], condicion: (n: number) => boolean): number[] {\n  const resultado: number[] = [];\n  for (const n of numeros) {\n    if (condicion(n)) {\n      resultado.push(n);\n    }\n  }\n  return resultado;\n}\n\nconst numeros: number[] = lineas[0].split(' ').map(Number);\nconst umbral: number = Number(lineas[1]);\nconsole.log(filtrar(numeros, (n: number) => n > umbral).join(' '));\n`,
        difficulty: 3,
        testCases: [
          { input: '1 5 3 8\n3', expectedOutput: '5 8', isHidden: false },
          { input: '10 20 30\n25', expectedOutput: '30', isHidden: false },
          { input: '4 4 4\n4', expectedOutput: '', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee un factor (línea 1) y una línea de números (línea 2). Usa `multiplicador(factor)` para imprimir cada número multiplicado, separados por espacios.',
        starterCode: `${ENTRADA}function multiplicador(factor: number): (n: number) => number {\n  // TODO\n}\n\nconst f = multiplicador(Number(lineas[0]));\nconst numeros: number[] = lineas[1].split(' ').map(Number);\nconsole.log(numeros.map(f).join(' '));\n`,
        solution: `${ENTRADA}function multiplicador(factor: number): (n: number) => number {\n  return (n: number): number => n * factor;\n}\n\nconst f = multiplicador(Number(lineas[0]));\nconst numeros: number[] = lineas[1].split(' ').map(Number);\nconsole.log(numeros.map(f).join(' '));\n`,
        difficulty: 3,
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '3 6 9', isHidden: false },
          { input: '10\n5', expectedOutput: '50', isHidden: false },
          { input: '-1\n4 -2', expectedOutput: '-4 2', isHidden: true },
        ],
      },
    ],
  },
];
