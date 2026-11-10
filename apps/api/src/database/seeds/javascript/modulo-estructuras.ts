import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

export const moduloEstructuras: SeedModule = {
  title: 'Estructuras de datos',
  lessons: [
    {
      title: 'Desestructuración',
      xpReward: 10,
      contentMarkdown: md`
# Desestructuración

La **desestructuración** reparte los valores de un array o de un objeto en variables, en un solo paso.

## De arrays

§§§javascript
const [x, y] = [3, 4];
console.log(x); // 3
console.log(y); // 4

const [primero, , tercero] = ["a", "b", "c"]; // salta el segundo
§§§

Es la forma elegante de **intercambiar** dos variables:

§§§javascript
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
§§§

## De objetos

Se usan los **nombres** de las propiedades (el orden no importa):

§§§javascript
const persona = { nombre: "Ana", edad: 20 };
const { nombre, edad } = persona;

const { nombre: titulo } = persona; // renombrar a "titulo"
const { ciudad = "Lima" } = persona; // valor por defecto si no existe
§§§

## Funciones que devuelven varios valores

§§§javascript
function minYMax(a, b, c) {
return [Math.min(a, b, c), Math.max(a, b, c)];
}

const [menor, mayor] = minYMax(5, 2, 9);
§§§

## El resto: §...§

§§§javascript
const [cabeza, ...cola] = [1, 2, 3, 4];
// cabeza = 1, cola = [2, 3, 4]
§§§

**Error típico:** desestructurar con corchetes algo que no es iterable. §const [x, y] = {x: 1, y: 2}§ lanza §TypeError§: para objetos hay que usar llaves.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'let a = 1;\nlet b = 2;\n[a, b] = [b, a];\nconsole.log(a, b);',
            options: ['1 2', '2 1', '2 2', '1 1'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'const { nombre } = { nombre: "Ana", edad: 3 };\nconsole.log(nombre);',
            options: ['Ana', '3', 'undefined', '{ nombre: "Ana" }'],
            correctIndex: 0,
          },
        },
        {
          type: 'fill',
          prompt: 'Desestructura el array en dos variables y súmalas.',
          difficulty: 1,
          payload: {
            template: 'const [x, {{0}}] = [3, 4];\nconsole.log(x + {{1}});',
            blanks: ['y', 'y'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros (uno por línea) e imprímelos intercambiados, separados por un espacio. Usa desestructuración.',
          starterCode: `${LINEAS}let [a, b] = lineas.map(Number);\n`,
          solution: `${LINEAS}let [a, b] = lineas.map(Number);\n[a, b] = [b, a];\nconsole.log(a, b);\n`,
          difficulty: 1,
          testCases: [
            { input: '3\n7', expectedOutput: '7 3', isHidden: false },
            { input: '-1\n0', expectedOutput: '0 -1', isHidden: false },
            { input: '5\n5', expectedOutput: '5 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `minYMax(a, b, c)` que devuelva un array con el menor y el mayor. Lee tres enteros (uno por línea) e imprime `menor mayor` separados por un espacio.',
          starterCode: `function minYMax(a, b, c) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const [a, b, c] = lineas.map(Number);\nconst [menor, mayor] = minYMax(a, b, c);\nconsole.log(menor, mayor);\n`,
          solution: `function minYMax(a, b, c) {\n  return [Math.min(a, b, c), Math.max(a, b, c)];\n}\n\n${LINEAS}const [a, b, c] = lineas.map(Number);\nconst [menor, mayor] = minYMax(a, b, c);\nconsole.log(menor, mayor);\n`,
          difficulty: 2,
          testCases: [
            { input: '5\n2\n9', expectedOutput: '2 9', isHidden: false },
            { input: '-4\n-9\n0', expectedOutput: '-9 0', isHidden: false },
            { input: '3\n3\n3', expectedOutput: '3 3', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee las coordenadas `x y` de un punto en una sola línea (dos enteros separados por espacio) e imprime `x * x + y * y`.',
          starterCode: `${LINEAS}const [x, y] = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const [x, y] = lineas[0].split(' ').map(Number);\nconsole.log(x * x + y * y);\n`,
          difficulty: 2,
          testCases: [
            { input: '3 4', expectedOutput: '25', isHidden: false },
            { input: '0 5', expectedOutput: '25', isHidden: false },
            { input: '-2 -2', expectedOutput: '8', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa falla al desestructurar el punto. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'const punto = { x: 3, y: 4 };',
              'const [x, y] = punto;',
              'console.log(x, y);',
            ],
            buggyLineIndex: 1,
            explanation:
              'Los objetos no son iterables, así que no se desestructuran con corchetes (TypeError). Hay que usar llaves con los nombres de las propiedades: `const { x, y } = punto;`.',
          },
        },
      ],
    },
    {
      title: 'Set y Map',
      xpReward: 10,
      contentMarkdown: md`
# Set y Map

## Set: elementos sin repetir

Un **Set** guarda valores **únicos**, recordando el orden de inserción.

§§§javascript
const numeros = new Set([1, 2, 2, 3, 3, 3]);
console.log(numeros.size); // 3
numeros.add(4); // agrega
numeros.delete(1); // quita
numeros.has(3); // true — muy rápido
§§§

### Quitar repetidos de un array

§§§javascript
const lista = [1, 2, 2, 3, 3, 3];
const unicos = [...new Set(lista)]; // [1, 2, 3]
§§§

### Operaciones entre conjuntos

JavaScript no trae §|§ ni §&§ para sets; se arman con §filter§:

§§§javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const union = new Set([...a, ...b]); // 1,2,3,4
const comunes = [...a].filter((n) => b.has(n)); // [2, 3]
const soloEnA = [...a].filter((n) => !b.has(n)); // [1]
§§§

Un Set **no tiene índices**: §numeros[0]§ es §undefined§. Si lo necesitas como array, conviértelo con §[...numeros]§.

## Map: pares clave-valor

Como un objeto, pero **cualquier valor puede ser clave** y conoce su tamaño:

§§§javascript
const notas = new Map();
notas.set("Ana", 90);
notas.set("Luis", 80);
notas.get("Ana"); // 90
notas.has("Eva"); // false
notas.size; // 2

for (const [nombre, nota] of notas) {
console.log(nombre, nota);
}
§§§

¿Objeto o Map? Para datos fijos con nombres conocidos, un objeto. Para colecciones que crecen (contadores, caches), un Map.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(new Set([1, 2, 2, 3, 3, 3]).size);',
            options: ['6', '3', '2', '1'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'const a = new Set([1, 2, 3]);\nconst b = new Set([2, 3, 4]);\nconsole.log([...a].filter((n) => b.has(n)));',
            options: ['[ 1, 2, 3, 4 ]', '[ 2, 3 ]', '[ 1 ]', '[ 4 ]'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Agrega un elemento al conjunto y muestra cuántos hay.',
          difficulty: 1,
          payload: {
            template:
              'const a = new Set([1, 2]);\na.{{0}}(3);\nconsole.log(a.{{1}});',
            blanks: ['add', 'size'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprime cuántos valores **distintos** hay.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(new Set(lineas[0].split(' ')).size);\n`,
          difficulty: 1,
          testCases: [
            { input: '1 2 2 3 3 3', expectedOutput: '3', isHidden: false },
            { input: '5 5 5', expectedOutput: '1', isHidden: false },
            { input: '1 2 3 4', expectedOutput: '4', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos líneas de enteros separados por espacios. Imprime, ordenados de menor a mayor y separados por un espacio, los números que aparecen en **ambas** líneas. Si no hay ninguno, imprime `ninguno`.',
          starterCode: `${LINEAS}const a = new Set(lineas[0].split(' ').map(Number));\nconst b = new Set(lineas[1].split(' ').map(Number));\n`,
          solution: `${LINEAS}const a = new Set(lineas[0].split(' ').map(Number));\nconst b = new Set(lineas[1].split(' ').map(Number));\nconst comunes = [...a].filter((n) => b.has(n)).sort((x, y) => x - y);\nconsole.log(comunes.length > 0 ? comunes.join(' ') : 'ninguno');\n`,
          difficulty: 3,
          testCases: [
            {
              input: '1 2 3 4\n3 4 5 6',
              expectedOutput: '3 4',
              isHidden: false,
            },
            { input: '1 2\n3 4', expectedOutput: 'ninguno', isHidden: false },
            { input: '5 5 1\n1 5 9', expectedOutput: '1 5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime `unicas` si todas sus letras son distintas, o `repetidas` si alguna letra aparece más de una vez.',
          starterCode: LINEAS,
          solution: `${LINEAS}const palabra = lineas[0];\nconsole.log(new Set(palabra).size === palabra.length ? 'unicas' : 'repetidas');\n`,
          difficulty: 2,
          testCases: [
            { input: 'python', expectedOutput: 'unicas', isHidden: false },
            {
              input: 'hola mundo',
              expectedOutput: 'repetidas',
              isHidden: false,
            },
            { input: 'sol', expectedOutput: 'unicas', isHidden: true },
            { input: 'casa', expectedOutput: 'repetidas', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa intenta leer el primer elemento del conjunto y falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'const numeros = new Set([10, 20, 30]);',
              'console.log(numeros[0].toFixed(1));',
            ],
            buggyLineIndex: 1,
            explanation:
              'Un Set no tiene índices: `numeros[0]` es `undefined` y `.toFixed()` falla (TypeError). Hay que convertirlo antes: `[...numeros][0]`.',
          },
        },
      ],
    },
    {
      title: 'Recorrer y ordenar arrays',
      xpReward: 10,
      contentMarkdown: md`
# Recorrer y ordenar arrays

## Resumir valores

§§§javascript
const numeros = [4, 9, 1, 7];
Math.max(...numeros); // 9 (el §...§ reparte el array)
Math.min(...numeros); // 1
numeros.reduce((suma, n) => suma + n, 0); // 21
numeros.length; // 4
§§§

## Ordenar con §sort()§ (¡cuidado!)

Por defecto §sort()§ ordena **como texto**, no como números:

§§§javascript
[10, 9, 1].sort(); // [1, 10, 9] (!)
[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10] ascendente
[10, 9, 1].sort((a, b) => b - a); // [10, 9, 1] descendente
§§§

La función de comparación devuelve un número negativo, cero o positivo según cuál va primero. Además **§sort()§ modifica el array original**. Para conservarlo, copia antes: §[...numeros].sort(...)§.

## Recorrer

§§§javascript
for (const fruta of ["pera", "uva"]) {
console.log(fruta);
}

for (const [i, fruta] of ["pera", "uva"].entries()) {
console.log(i + 1, fruta); // 1 pera / 2 uva
}

["pera", "uva"].forEach((fruta, i) => console.log(i, fruta));
§§§

## Preguntar por toda la colección

§§§javascript
numeros.some((n) => n < 0); // ¿hay algún negativo?
numeros.every((n) => n > 0); // ¿todos son positivos?
numeros.find((n) => n > 5); // 9 (el primero que cumple)
numeros.includes(7); // true
§§§
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 3,
          payload: {
            code: 'console.log([10, 9, 1].sort());',
            options: [
              '[ 1, 9, 10 ]',
              '[ 1, 10, 9 ]',
              '[ 10, 9, 1 ]',
              '[ 9, 10, 1 ]',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log([3, 1, 2].sort((a, b) => b - a));',
            options: ['[ 1, 2, 3 ]', '[ 3, 2, 1 ]', '[ 3, 1, 2 ]', 'undefined'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Recorre el array con su posición y ordénalo.',
          difficulty: 2,
          payload: {
            template:
              'for (const [i, x] of ["a", "b"].{{0}}()) {\n  console.log(i, x);\n}\nconsole.log(["b", "a"].{{1}}());',
            blanks: ['entries', 'sort'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprime el mayor, el menor y la suma, separados por un espacio.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconst suma = numeros.reduce((total, n) => total + n, 0);\nconsole.log(Math.max(...numeros), Math.min(...numeros), suma);\n`,
          difficulty: 1,
          testCases: [
            { input: '3 1 5 4', expectedOutput: '5 1 13', isHidden: false },
            { input: '7', expectedOutput: '7 7 7', isHidden: false },
            { input: '-2 -8 0', expectedOutput: '0 -8 -10', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios e imprímelos ordenados de mayor a menor, separados por un espacio.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconsole.log(numeros.sort((a, b) => b - a).join(' '));\n`,
          difficulty: 2,
          testCases: [
            { input: '3 1 2', expectedOutput: '3 2 1', isHidden: false },
            {
              input: '10 -5 7 7',
              expectedOutput: '10 7 7 -5',
              isHidden: false,
            },
            { input: '4', expectedOutput: '4', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea con nombres separados por espacios e imprime una lista numerada desde 1, un nombre por línea, con el formato `1. Ana`.',
          starterCode: `${LINEAS}const nombres = lineas[0].split(' ');\n`,
          solution: `${LINEAS}const nombres = lineas[0].split(' ');\nnombres.forEach((nombre, i) => {\n  console.log(String(i + 1) + '. ' + nombre);\n});\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'Ana Luis Eva',
              expectedOutput: '1. Ana\n2. Luis\n3. Eva',
              isHidden: false,
            },
            { input: 'Sofía', expectedOutput: '1. Sofía', isHidden: false },
            { input: 'a b', expectedOutput: '1. a\n2. b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros separados por espacios. Imprime `si` si alguno es negativo, o `no` si ninguno lo es.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconsole.log(numeros.some((n) => n < 0) ? 'si' : 'no');\n`,
          difficulty: 2,
          testCases: [
            { input: '1 2 -3 4', expectedOutput: 'si', isHidden: false },
            { input: '1 2 3', expectedOutput: 'no', isHidden: false },
            { input: '0 0', expectedOutput: 'no', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere imprimir el número mayor (100), pero el programa imprime 9. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'const numeros = [10, 9, 100, 1];',
              'numeros.sort();',
              'console.log(numeros[numeros.length - 1]);',
            ],
            buggyLineIndex: 1,
            explanation:
              '`sort()` sin función de comparación ordena como texto: ["1", "10", "100", "9"], así que el último es 9. Hay que usar `numeros.sort((a, b) => a - b)`.',
          },
        },
      ],
    },
    {
      title: 'Arrays anidados, map y filter',
      xpReward: 15,
      contentMarkdown: md`
# Arrays anidados, map y filter

## Arrays dentro de arrays

Un array puede contener otros arrays. Es la forma habitual de representar una **tabla** o **matriz**:

§§§javascript
const matriz = [
[1, 2, 3],
[4, 5, 6],
[7, 8, 9],
];
console.log(matriz[1][2]); // 6 (fila 1, columna 2)
§§§

Para recorrerla se anidan dos bucles:

§§§javascript
for (const fila of matriz) {
let texto = "";
for (const valor of fila) {
texto += valor + " ";
}
console.log(texto.trim());
}
§§§

## §map()§ y §filter()§

Crean arrays nuevos sin modificar el original:

§§§javascript
[0, 1, 2, 3].map((n) => n * 2); // [0, 2, 4, 6]
[0, 1, 2, 3, 4].filter((n) => n % 2 === 0); // [0, 2, 4]
"hola".split("").map((l) => l.toUpperCase()); // ["H", "O", "L", "A"]
§§§

Se pueden encadenar:

§§§javascript
[1, 2, 3, 4, 5]
.filter((n) => n % 2 === 1)
.map((n) => n * n); // [1, 9, 25]
§§§

## Aplanar una matriz

§§§javascript
matriz.flat(); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
§§§

## Crear una matriz

§§§javascript
const filas = Array.from({ length: 2 }, () => [0, 0]);   // filas independientes
const mala = new Array(2).fill([0, 0]);                  // ¡las dos filas son LA MISMA!
mala[0][0] = 1;
console.log(mala);   // [[1, 0], [1, 0]]
§§§
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'const m = [[1, 2], [3, 4]];\nconsole.log(m[1][0]);',
            options: ['1', '2', '3', '4'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log([0, 1, 2, 3].map((n) => n * 2));',
            options: [
              '[ 0, 1, 2, 3 ]',
              '[ 0, 2, 4, 6 ]',
              '[ 2, 4, 6, 8 ]',
              '[ 0, 2, 4 ]',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa: quédate con los pares y calcula los cuadrados.',
          difficulty: 2,
          payload: {
            template:
              'const pares = [1, 2, 3, 4].{{0}}((n) => n % 2 === 0);\nconst cuadrados = [1, 2, 3].{{1}}((n) => n * n);',
            blanks: ['filter', 'map'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un entero `n` (de 1 a 9) e imprime su tabla de multiplicar del 1 al 10, una línea por producto, con el formato `3 x 2 = 6`.',
          starterCode: `${LINEAS}const n = parseInt(lineas[0], 10);\n`,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nfor (let i = 1; i <= 10; i++) {\n  console.log(n + ' x ' + i + ' = ' + n * i);\n}\n`,
          difficulty: 1,
          testCases: [
            {
              input: '3',
              expectedOutput:
                '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
              isHidden: false,
            },
            {
              input: '1',
              expectedOutput:
                '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10',
              isHidden: false,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una matriz de 3 filas (cada fila son 3 enteros separados por espacios, una fila por línea) e imprime la suma de su diagonal principal (posiciones [0][0], [1][1] y [2][2]).',
          starterCode: `${LINEAS}const matriz = lineas.map((fila) => fila.split(' ').map(Number));\n`,
          solution: `${LINEAS}const matriz = lineas.map((fila) => fila.split(' ').map(Number));\nconsole.log(matriz[0][0] + matriz[1][1] + matriz[2][2]);\n`,
          difficulty: 3,
          testCases: [
            {
              input: '1 2 3\n4 5 6\n7 8 9',
              expectedOutput: '15',
              isHidden: false,
            },
            {
              input: '1 0 0\n0 1 0\n0 0 1',
              expectedOutput: '3',
              isHidden: false,
            },
            {
              input: '5 5 5\n5 -1 5\n5 5 2',
              expectedOutput: '6',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime, separados por un espacio, el cuadrado de cada número **impar**. Si no hay impares, imprime `ninguno`. Usa `filter` y `map`.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconst cuadrados = numeros.filter((n) => n % 2 !== 0).map((n) => n * n);\nconsole.log(cuadrados.length > 0 ? cuadrados.join(' ') : 'ninguno');\n`,
          difficulty: 3,
          testCases: [
            { input: '1 2 3 4 5', expectedOutput: '1 9 25', isHidden: false },
            { input: '2 4 6', expectedOutput: 'ninguno', isHidden: false },
            { input: '7', expectedOutput: '49', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un entero `n` e imprime un triángulo de `n` filas hecho de asteriscos: la fila 1 tiene 1 `*`, la fila 2 tiene 2, y así hasta `n`.',
          starterCode: `${LINEAS}const n = parseInt(lineas[0], 10);\n`,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nfor (let fila = 1; fila <= n; fila++) {\n  console.log('*'.repeat(fila));\n}\n`,
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
          type: 'bug',
          prompt:
            'La matriz tiene 2 filas, pero el programa falla al leer la última. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'const matriz = [[1, 2], [3, 4]];',
              'console.log(matriz[0][0]);',
              'console.log(matriz[2][0]);',
            ],
            buggyLineIndex: 2,
            explanation:
              'Hay dos filas, con índices 0 y 1. `matriz[2]` es `undefined` y leer `[0]` de `undefined` lanza TypeError; la última fila es `matriz[1]` o `matriz.at(-1)`.',
          },
        },
      ],
    },
  ],
};
