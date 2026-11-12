import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Fundamentos, lecciones 6-7.
export const fundamentosParte3: SeedLesson[] = [
  {
    title: 'Arrays tipados',
    xpReward: 10,
    contentMarkdown: md`
# Arrays tipados

Un array guarda una lista ordenada de valores. En TypeScript **todos los elementos tienen el mismo tipo**, y lo escribes con §tipo[]§.

## Declarar arrays

§§§typescript
const edades: number[] = [20, 31, 18];
const nombres: string[] = ["Ana", "Luis"];
const vacio: number[] = [];
§§§

Existe otra forma equivalente, §Array<number>§, pero §number[]§ es la más usada.

## Acceder y modificar

§§§typescript
edades[0]; // 20 (el primer elemento es el índice 0)
edades.length; // 3
edades.push(25); // agrega al final
edades.push("25"); // Error: string no es number
§§§

## Recorrer

§§§typescript
for (const edad of edades) {
console.log(edad);
}
§§§

## Métodos muy útiles

§§§typescript
const dobles: number[] = edades.map((e: number) => e * 2);
const adultos: number[] = edades.filter((e: number) => e >= 18);
const total: number = edades.reduce((acum: number, e: number) => acum + e, 0);
const texto: string = nombres.join(", "); // "Ana, Luis"
§§§

- §map§ transforma cada elemento y devuelve un array nuevo.
- §filter§ se queda con los que cumplen la condición.
- §reduce§ junta todos en un solo valor.

## Ordenar números

§sort()§ sin argumentos ordena como **texto** (§[10, 9, 1]§ queda §[1, 10, 9]§). Para números pasa una función de comparación:

§§§typescript
edades.sort((a: number, b: number) => a - b); // de menor a mayor
§§§

## Texto a array

Los datos de entrada llegan en una línea de texto; §split§ la convierte en array:

§§§typescript
const numeros: number[] = "1 2 3".split(" ").map(Number); // [1, 2, 3]
§§§
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué pasa con este código?',
        difficulty: 1,
        payload: {
          code: 'const nums: number[] = [1, 2, "3"];',
          options: [
            'Funciona: "3" se convierte en 3',
            'El compilador marca un error: "3" no es un number',
            'nums vale [1, 2]',
            'Lanza un error al ejecutar',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué tipo tiene `nombres[0]`?',
        difficulty: 1,
        payload: {
          code: 'const nombres: string[] = ["Ana", "Luis"];\nconst primero = nombres[0];',
          options: ['number', 'string[]', 'string', 'any'],
          correctIndex: 2,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'const n: number[] = [1, 2, 3, 4];\nconsole.log(n.filter((x: number) => x % 2 === 0).join("-"));',
          options: ['1-3', '2-4', '2-4-', '[2, 4]'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara `edades` como un array de números.',
        difficulty: 1,
        payload: {
          template: 'const edades: {{0}} = [20, 30];',
          blanks: ['number[]'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador protesta. ¿Qué línea tiene el error de tipos?',
        difficulty: 2,
        payload: {
          lines: [
            'const precios: number[] = [10, 20];',
            'precios.push(30);',
            'precios.push("40");',
            'console.log(precios.length);',
          ],
          buggyLineIndex: 2,
          explanation:
            'precios es un array de numbers: no se puede agregar el texto "40".',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas para sumar los elementos de un array.',
        difficulty: 2,
        payload: {
          blocks: [
            'const n: number[] = [3, 4, 5];',
            'let suma: number = 0;',
            'for (const x of n) {',
            '  suma += x;',
            '}',
            'console.log(suma);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee una línea con números separados por espacios e imprime su suma.',
        starterCode: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\n`,
        solution: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\nlet suma: number = 0;\nfor (const n of numeros) {\n  suma += n;\n}\nconsole.log(suma);\n`,
        difficulty: 1,
        testCases: [
          { input: '1 2 3', expectedOutput: '6', isHidden: false },
          { input: '10 -4 7 1', expectedOutput: '14', isHidden: false },
          { input: '5', expectedOutput: '5', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea con números separados por espacios e imprime el mayor.',
        starterCode: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\n`,
        solution: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\nlet mayor: number = numeros[0];\nfor (const n of numeros) {\n  if (n > mayor) {\n    mayor = n;\n  }\n}\nconsole.log(mayor);\n`,
        difficulty: 2,
        testCases: [
          { input: '3 9 2', expectedOutput: '9', isHidden: false },
          { input: '-5 -2 -9', expectedOutput: '-2', isHidden: false },
          { input: '7', expectedOutput: '7', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea con números separados por espacios e imprime los pares, separados por un espacio, en el mismo orden.',
        starterCode: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\n`,
        solution: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\nconst pares: number[] = numeros.filter((n: number) => n % 2 === 0);\nconsole.log(pares.join(' '));\n`,
        difficulty: 2,
        testCases: [
          { input: '1 2 3 4 5 6', expectedOutput: '2 4 6', isHidden: false },
          { input: '10 15 20', expectedOutput: '10 20', isHidden: false },
          { input: '8 8 3', expectedOutput: '8 8', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una línea con números separados por espacios e imprímelos ordenados de menor a mayor, separados por un espacio.',
        starterCode: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\n`,
        solution: `${ENTRADA}const numeros: number[] = lineas[0].split(' ').map(Number);\nnumeros.sort((a: number, b: number) => a - b);\nconsole.log(numeros.join(' '));\n`,
        difficulty: 3,
        testCases: [
          { input: '5 3 9 1', expectedOutput: '1 3 5 9', isHidden: false },
          { input: '10 9 1', expectedOutput: '1 9 10', isHidden: false },
          { input: '2 2 1', expectedOutput: '1 2 2', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Interfaces y objetos',
    xpReward: 10,
    contentMarkdown: md`
# Interfaces y objetos

Un **objeto** agrupa datos relacionados bajo nombres (propiedades). Una **interfaz** describe la forma que debe tener ese objeto.

## Definir una interfaz

§§§typescript
interface Persona {
nombre: string;
edad: number;
}

const ana: Persona = { nombre: "Ana", edad: 20 };
§§§

La interfaz no crea nada en el programa final: es solo una descripción que el compilador usa para revisar tu código.

## El compilador revisa la forma

§§§typescript
const luis: Persona = { nombre: "Luis" };
// Error: Property 'edad' is missing in type '{ nombre: string; }'

console.log(ana.nmbre);
// Error: Property 'nmbre' does not exist on type 'Persona'. Did you mean 'nombre'?
§§§

Los errores de escritura en propiedades, que en JavaScript dan §undefined§ sin avisar, aquí se detectan antes de ejecutar.

## Leer y cambiar propiedades

§§§typescript
ana.edad = 21;
console.log(\`\${ana.nombre} tiene \${ana.edad} años\`);
§§§

## Funciones que reciben objetos

§§§typescript
function presentar(p: Persona): string {
return \`\${p.nombre} (\${p.edad})\`;
}
§§§

## Arrays de objetos

§§§typescript
const grupo: Persona[] = [
{ nombre: "Ana", edad: 20 },
{ nombre: "Luis", edad: 31 },
];
const nombres: string[] = grupo.map((p: Persona) => p.nombre);
§§§

## Métodos en la interfaz

Una propiedad también puede ser una función:

§§§typescript
interface Contador {
valor: number;
incrementar(): void;
}
§§§
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con este código?',
        difficulty: 1,
        payload: {
          code: 'interface Persona {\n  nombre: string;\n  edad: number;\n}\nconst luis: Persona = { nombre: "Luis" };',
          options: [
            'Funciona: edad queda en undefined',
            'Marca un error: falta la propiedad edad',
            'Asigna edad = 0',
            'Lanza un error al ejecutar',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué pasa al escribir `ana.nmbre`?',
        difficulty: 2,
        payload: {
          code: 'const ana: Persona = { nombre: "Ana", edad: 20 };\nconsole.log(ana.nmbre);',
          options: [
            'Imprime undefined',
            'Imprime "Ana"',
            'El compilador marca que la propiedad nmbre no existe',
            'Lanza un error al ejecutar',
          ],
          correctIndex: 2,
        },
      },
      {
        type: 'fill',
        prompt: 'Define la forma de un punto con dos coordenadas numéricas.',
        difficulty: 1,
        payload: {
          template: '{{0}} Punto {\n  x: number;\n  y: {{1}};\n}',
          blanks: ['interface', 'number'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'interface Producto {',
            '  nombre: string;',
            '  precio: number;',
            '}',
            'const p: Producto = { nombre: "Cuaderno", precio: "2500" };',
            'console.log(p.precio);',
          ],
          buggyLineIndex: 4,
          explanation:
            'precio debe ser un number, pero "2500" es un string. Hay que escribir 2500 sin comillas.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: define la interfaz, crea el objeto e imprímelo.',
        difficulty: 2,
        payload: {
          blocks: [
            'interface Persona {',
            '  nombre: string;',
            '}',
            'const p: Persona = { nombre: "Ana" };',
            'console.log(p.nombre);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (línea 1) y una edad (línea 2). Crea un objeto `Persona` e imprime `nombre (edad)`.',
        starterCode: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\n`,
        solution: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nconst p: Persona = { nombre: lineas[0], edad: Number(lineas[1]) };\nconsole.log(\`\${p.nombre} (\${p.edad})\`);\n`,
        difficulty: 1,
        testCases: [
          { input: 'Ana\n20', expectedOutput: 'Ana (20)', isHidden: false },
          { input: 'Luis\n31', expectedOutput: 'Luis (31)', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee nombre, precio y cantidad (una por línea). Imprime `Total de <nombre>: <total>` con 2 decimales, donde total = precio × cantidad.',
        starterCode: `${ENTRADA}interface Producto {\n  nombre: string;\n  precio: number;\n  cantidad: number;\n}\n\n`,
        solution: `${ENTRADA}interface Producto {\n  nombre: string;\n  precio: number;\n  cantidad: number;\n}\n\nconst p: Producto = {\n  nombre: lineas[0],\n  precio: Number(lineas[1]),\n  cantidad: Number(lineas[2]),\n};\nconst total: number = p.precio * p.cantidad;\nconsole.log(\`Total de \${p.nombre}: \${total.toFixed(2)}\`);\n`,
        difficulty: 2,
        testCases: [
          {
            input: 'Cuaderno\n2500\n3',
            expectedOutput: 'Total de Cuaderno: 7500.00',
            isHidden: false,
          },
          {
            input: 'Lapiz\n0.5\n10',
            expectedOutput: 'Total de Lapiz: 5.00',
            isHidden: false,
          },
          {
            input: 'Regla\n1200\n1',
            expectedOutput: 'Total de Regla: 1200.00',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'La primera línea es N; las N siguientes tienen `nombre nota`. Imprime el nombre del estudiante con la nota más alta.',
        starterCode: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  nota: number;\n}\n\nconst n: number = Number(lineas[0]);\nconst estudiantes: Estudiante[] = [];\n`,
        solution: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  nota: number;\n}\n\nconst n: number = Number(lineas[0]);\nconst estudiantes: Estudiante[] = [];\nfor (let i: number = 1; i <= n; i++) {\n  const partes: string[] = lineas[i].split(' ');\n  estudiantes.push({ nombre: partes[0], nota: Number(partes[1]) });\n}\nlet mejor: Estudiante = estudiantes[0];\nfor (const e of estudiantes) {\n  if (e.nota > mejor.nota) {\n    mejor = e;\n  }\n}\nconsole.log(mejor.nombre);\n`,
        difficulty: 3,
        testCases: [
          {
            input: '3\nAna 8\nLuis 9\nMaria 7',
            expectedOutput: 'Luis',
            isHidden: false,
          },
          {
            input: '2\nPedro 5\nSofia 5.5',
            expectedOutput: 'Sofia',
            isHidden: false,
          },
          { input: '1\nZoe 10', expectedOutput: 'Zoe', isHidden: true },
        ],
      },
    ],
  },
];
