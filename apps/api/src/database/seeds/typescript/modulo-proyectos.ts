import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    {
      title: 'Proyecto: calculadora tipada',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: calculadora tipada

Vas a construir una calculadora que lee operaciones como §6 + 3§ y calcula el resultado, con los tipos protegiéndote de operaciones inválidas.

## Paso 1: modelar la operación

Las operaciones permitidas son un conjunto cerrado: una unión de literales.

§§§typescript
type Operador = "+" | "-" | "*" | "/";
§§§

## Paso 2: la función que calcula

§§§typescript
function calcular(a: number, b: number, op: Operador): number {
switch (op) {
case "+": return a + b;
case "-": return a - b;
case "*": return a * b;
case "/": return a / b;
}
}
§§§

§switch§ compara un valor con varios §case§. Como §Operador§ solo admite cuatro valores, TypeScript sabe que la función siempre devuelve un número: **ningún caso queda sin cubrir**. Si añades un operador a la unión y olvidas su §case§, el compilador te lo hará notar.

## Paso 3: leer la entrada

Una línea como §6 + 3§ se separa en partes:

§§§typescript
const partes: string[] = linea.split(" ");
const a: number = Number(partes[0]);
const op = partes[1] as Operador;
const b: number = Number(partes[2]);
§§§

§as Operador§ le dice al compilador "confía en mí: este texto es un operador". Úsalo con cuidado: aquí es correcto porque los datos de prueba solo traen operadores válidos.

## Paso 4: casos especiales

La división entre cero no es un error de tipos, así que hay que tratarla tú:

§§§typescript
if (op === "/" && b === 0) {
return "error";
}
§§§

## Qué has practicado

Uniones de literales, §switch§, funciones tipadas, conversión de entrada y manejo de casos límite.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Cuál es el resultado de `calcular(6, 3, "/")`?',
          difficulty: 1,
          payload: {
            code: 'type Operador = "+" | "-" | "*" | "/";\nfunction calcular(a: number, b: number, op: Operador): number {\n  switch (op) {\n    case "+": return a + b;\n    case "-": return a - b;\n    case "*": return a * b;\n    case "/": return a / b;\n  }\n}',
            options: ['18', '9', '2', '3'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué hace el compilador con esta llamada?',
          difficulty: 2,
          payload: {
            code: 'type Operador = "+" | "-" | "*" | "/";\nfunction calcular(a: number, b: number, op: Operador): number {\n  return 0;\n}\ncalcular(1, 2, "%");',
            options: [
              'Devuelve 0',
              'Marca un error: "%" no es un Operador',
              'Devuelve NaN',
              'Lanza un error al ejecutar',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa el `switch` para que el caso de la resta funcione.',
          difficulty: 2,
          payload: {
            template:
              'switch (op) {\n  case "+": return a + b;\n  {{0}} "-": return a - b;\n}',
            blanks: ['case'],
          },
        },
        {
          type: 'bug',
          prompt:
            'La calculadora multiplica cuando debería sumar. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'function calcular(a: number, b: number, op: string): number {',
              '  if (op === "+") return a * b;',
              '  if (op === "-") return a - b;',
              '  return 0;',
              '}',
            ],
            buggyLineIndex: 1,
            explanation: 'Para "+" debe devolver a + b, no a * b.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que leen `a op b` y lo separan en partes.',
          difficulty: 2,
          payload: {
            blocks: [
              'const partes: string[] = linea.split(" ");',
              'const a: number = Number(partes[0]);',
              'const op: string = partes[1];',
              'const b: number = Number(partes[2]);',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una operación como `6 + 3` (operadores `+ - * /`) e imprime el resultado. Si divides entre cero, imprime `error`.',
          starterCode: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  // TODO\n}\n\nconst partes: string[] = lineas[0].split(' ');\nconst a: number = Number(partes[0]);\nconst op = partes[1] as Operador;\nconst b: number = Number(partes[2]);\n`,
          solution: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    case '/':\n      return a / b;\n  }\n}\n\nconst partes: string[] = lineas[0].split(' ');\nconst a: number = Number(partes[0]);\nconst op = partes[1] as Operador;\nconst b: number = Number(partes[2]);\nif (op === '/' && b === 0) {\n  console.log('error');\n} else {\n  console.log(calcular(a, b, op));\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '6 + 3', expectedOutput: '9', isHidden: false },
            { input: '10 / 4', expectedOutput: '2.5', isHidden: false },
            { input: '5 / 0', expectedOutput: 'error', isHidden: false },
            { input: '7 * 6', expectedOutput: '42', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación (`a op b`). Imprime el resultado de cada una en su línea; si divide entre cero imprime `error`.',
          starterCode: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  // TODO\n}\n\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  // TODO\n}\n`,
          solution: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    case '/':\n      return a / b;\n  }\n}\n\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const a: number = Number(partes[0]);\n  const op = partes[1] as Operador;\n  const b: number = Number(partes[2]);\n  if (op === '/' && b === 0) {\n    console.log('error');\n  } else {\n    console.log(calcular(a, b, op));\n  }\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '1 + 2\n8 / 2', expectedOutput: '3\n4', isHidden: false },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '20\nerror\n-1',
              isHidden: false,
            },
            { input: '2 - 2', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es una operación. Imprime la **suma de todos los resultados** (ignora las divisiones entre cero).',
          starterCode: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  // TODO\n}\n\nlet total: number = 0;\n`,
          solution: `${ENTRADA}type Operador = "+" | "-" | "*" | "/";\n\nfunction calcular(a: number, b: number, op: Operador): number {\n  switch (op) {\n    case '+':\n      return a + b;\n    case '-':\n      return a - b;\n    case '*':\n      return a * b;\n    case '/':\n      return a / b;\n  }\n}\n\nlet total: number = 0;\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const a: number = Number(partes[0]);\n  const op = partes[1] as Operador;\n  const b: number = Number(partes[2]);\n  if (op === '/' && b === 0) {\n    continue;\n  }\n  total += calcular(a, b, op);\n}\nconsole.log(total);\n`,
          difficulty: 3,
          testCases: [
            { input: '1 + 2\n8 / 2', expectedOutput: '7', isHidden: false },
            {
              input: '4 * 5\n3 / 0\n9 - 10',
              expectedOutput: '19',
              isHidden: false,
            },
            { input: '5 / 0', expectedOutput: '0', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Proyecto: inventario',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: inventario

Vas a construir un pequeño inventario de tienda: agregar productos, venderlos y revisar cuánto queda.

## Paso 1: modelar un producto

§§§typescript
interface Producto {
nombre: string;
cantidad: number;
precio: number;
}
§§§

El inventario es un array de productos:

§§§typescript
const inventario: Producto[] = [];
§§§

## Paso 2: operaciones con funciones tipadas

§§§typescript
function agregar(inv: Producto[], p: Producto): void {
inv.push(p);
}

function buscar(inv: Producto[], nombre: string): Producto | undefined {
for (const p of inv) {
if (p.nombre === nombre) {
return p;
}
}
return undefined;
}
§§§

§buscar§ devuelve §Producto | undefined§: si no encuentra el producto, no hay nada que devolver. El tipo te recuerda que **debes comprobarlo**:

§§§typescript
const p = buscar(inventario, "lapiz");
if (p) {
p.cantidad -= 1;
}
§§§

## Paso 3: calcular

§§§typescript
function valorTotal(inv: Producto[]): number {
let total: number = 0;
for (const p of inv) {
total += p.cantidad * p.precio;
}
return total;
}
§§§

## Qué has practicado

Interfaces, arrays de objetos, uniones con §undefined§, funciones que modifican datos y acumuladores.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué tipo devuelve `buscar`?',
          difficulty: 1,
          payload: {
            code: 'function buscar(inv: Producto[], nombre: string): Producto | undefined {\n  for (const p of inv) {\n    if (p.nombre === nombre) {\n      return p;\n    }\n  }\n  return undefined;\n}',
            options: [
              'Siempre un Producto',
              'Un Producto o undefined si no existe',
              'Un array de productos',
              'Un string',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Cuál es el valor total de este inventario?',
          difficulty: 2,
          payload: {
            code: 'const inv: Producto[] = [\n  { nombre: "lapiz", cantidad: 10, precio: 2 },\n  { nombre: "cuaderno", cantidad: 3, precio: 5 },\n];\n// valorTotal suma cantidad * precio de cada producto',
            options: ['15', '35', '65', '20'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa la interfaz del producto.',
          difficulty: 1,
          payload: {
            template:
              '{{0}} Producto {\n  nombre: string;\n  cantidad: {{1}};\n  precio: number;\n}',
            blanks: ['interface', 'number'],
          },
        },
        {
          type: 'bug',
          prompt:
            'Este código falla al ejecutarse si el producto no existe. ¿Qué línea es la que falla?',
          difficulty: 3,
          payload: {
            lines: [
              'function vender(inv: Producto[], nombre: string): void {',
              '  const p = buscar(inv, nombre);',
              '  p.cantidad -= 1;',
              '}',
            ],
            buggyLineIndex: 2,
            explanation:
              'buscar puede devolver undefined: hay que comprobar if (p) antes de usar p.cantidad, o se produce un TypeError al ejecutar.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas de la función que calcula el valor total.',
          difficulty: 2,
          payload: {
            blocks: [
              'function valorTotal(inv: Producto[]): number {',
              '  let total: number = 0;',
              '  for (const p of inv) {',
              '    total += p.cantidad * p.precio;',
              '  }',
              '  return total;',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre cantidad precio`. Imprime el valor total del inventario (suma de cantidad × precio).',
          starterCode: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n  precio: number;\n}\n\nfunction valorTotal(inv: Producto[]): number {\n  // TODO\n}\n\nconst inventario: Producto[] = lineas.map((linea: string): Producto => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], cantidad: Number(p[1]), precio: Number(p[2]) };\n});\nconsole.log(valorTotal(inventario));\n`,
          solution: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n  precio: number;\n}\n\nfunction valorTotal(inv: Producto[]): number {\n  let total: number = 0;\n  for (const p of inv) {\n    total += p.cantidad * p.precio;\n  }\n  return total;\n}\n\nconst inventario: Producto[] = lineas.map((linea: string): Producto => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], cantidad: Number(p[1]), precio: Number(p[2]) };\n});\nconsole.log(valorTotal(inventario));\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'lapiz 10 2\ncuaderno 3 5',
              expectedOutput: '35',
              isHidden: false,
            },
            { input: 'regla 4 1.5', expectedOutput: '6', isHidden: false },
            {
              input: 'a 1 1\nb 2 2\nc 3 3',
              expectedOutput: '14',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre cantidad precio`. Imprime los nombres de los productos con **menos de 5 unidades**, uno por línea y en el mismo orden. Si no hay ninguno, imprime `todo en orden`.',
          starterCode: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n  precio: number;\n}\n\nconst inventario: Producto[] = lineas.map((linea: string): Producto => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], cantidad: Number(p[1]), precio: Number(p[2]) };\n});\n`,
          solution: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n  precio: number;\n}\n\nconst inventario: Producto[] = lineas.map((linea: string): Producto => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], cantidad: Number(p[1]), precio: Number(p[2]) };\n});\nconst bajos: Producto[] = inventario.filter((p: Producto) => p.cantidad < 5);\nif (bajos.length === 0) {\n  console.log('todo en orden');\n} else {\n  for (const p of bajos) {\n    console.log(p.nombre);\n  }\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'lapiz 10 2\ncuaderno 3 5\nregla 4 1',
              expectedOutput: 'cuaderno\nregla',
              isHidden: false,
            },
            {
              input: 'goma 9 1',
              expectedOutput: 'todo en orden',
              isHidden: false,
            },
            { input: 'a 5 1\nb 4 1', expectedOutput: 'b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Las líneas son comandos: `agregar <nombre> <cantidad>` suma unidades (crea el producto si no existe) y `vender <nombre> <cantidad>` las resta (si no hay suficientes, ignora la venta). Al final imprime `<nombre>: <cantidad>` por cada producto, en el orden en que aparecieron.',
          starterCode: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n}\n\nfunction buscar(inv: Producto[], nombre: string): Producto | undefined {\n  // TODO\n}\n\nconst inventario: Producto[] = [];\n`,
          solution: `${ENTRADA}interface Producto {\n  nombre: string;\n  cantidad: number;\n}\n\nfunction buscar(inv: Producto[], nombre: string): Producto | undefined {\n  for (const p of inv) {\n    if (p.nombre === nombre) {\n      return p;\n    }\n  }\n  return undefined;\n}\n\nconst inventario: Producto[] = [];\nfor (const linea of lineas) {\n  const partes: string[] = linea.split(' ');\n  const comando: string = partes[0];\n  const nombre: string = partes[1];\n  const cantidad: number = Number(partes[2]);\n  const existente: Producto | undefined = buscar(inventario, nombre);\n  if (comando === 'agregar') {\n    if (existente) {\n      existente.cantidad += cantidad;\n    } else {\n      inventario.push({ nombre, cantidad });\n    }\n  } else if (existente && existente.cantidad >= cantidad) {\n    existente.cantidad -= cantidad;\n  }\n}\nfor (const p of inventario) {\n  console.log(\`\${p.nombre}: \${p.cantidad}\`);\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'agregar lapiz 10\nvender lapiz 4',
              expectedOutput: 'lapiz: 6',
              isHidden: false,
            },
            {
              input: 'agregar a 5\nagregar b 2\nvender a 9\nagregar a 1',
              expectedOutput: 'a: 6\nb: 2',
              isHidden: false,
            },
            {
              input: 'vender x 1\nagregar x 3',
              expectedOutput: 'x: 3',
              isHidden: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: notas de estudiantes

Vas a procesar las notas de un grupo: calcular promedios, decidir quién aprueba y encontrar al mejor estudiante.

## Paso 1: modelar los datos

§§§typescript
interface Estudiante {
nombre: string;
notas: number[];
}

type Estado = "aprobado" | "reprobado";
§§§

Un estudiante tiene varias notas (un array) y su estado es una de dos opciones cerradas.

## Paso 2: funciones pequeñas

§§§typescript
function promedio(notas: number[]): number {
let suma: number = 0;
for (const n of notas) {
suma += n;
}
return suma / notas.length;
}

function estado(prom: number): Estado {
return prom >= 6 ? "aprobado" : "reprobado";
}
§§§

Cada función hace **una sola cosa** y tiene un tipo claro: son fáciles de probar y de reutilizar.

## Paso 3: recorrer el grupo

§§§typescript
for (const e of estudiantes) {
const p: number = promedio(e.notas);
console.log(\`\${e.nombre} \${p.toFixed(1)} \${estado(p)}\`);
}
§§§

## Paso 4: buscar al mejor

§§§typescript
let mejor: Estudiante = estudiantes[0];
for (const e of estudiantes) {
if (promedio(e.notas) > promedio(mejor.notas)) {
mejor = e;
}
}
§§§

## Qué has practicado

Interfaces con arrays, uniones de literales, funciones puras, recorridos y búsqueda del máximo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Cuál es el promedio de estas notas?',
          difficulty: 1,
          payload: {
            code: 'const notas: number[] = [4, 6, 8];\nlet suma: number = 0;\nfor (const n of notas) {\n  suma += n;\n}\nconsole.log(suma / notas.length);',
            options: ['4', '6', '8', '18'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué hace el compilador con esta función?',
          difficulty: 2,
          payload: {
            code: 'type Estado = "aprobado" | "reprobado";\nfunction estado(prom: number): Estado {\n  return prom >= 6 ? "aprobado" : "pendiente";\n}',
            options: [
              'Funciona',
              'Marca un error: "pendiente" no es un Estado',
              'Devuelve undefined',
              'Marca un error en la primera línea',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa la función que decide el estado.',
          difficulty: 2,
          payload: {
            template:
              'function estado(prom: number): Estado {\n  return prom {{0}} 6 ? "aprobado" : "reprobado";\n}',
            blanks: ['>='],
          },
        },
        {
          type: 'bug',
          prompt: 'El promedio sale mal. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'function promedio(notas: number[]): number {',
              '  let suma: number = 0;',
              '  for (const n of notas) {',
              '    suma += n;',
              '  }',
              '  return suma / 2;',
              '}',
            ],
            buggyLineIndex: 5,
            explanation:
              'Hay que dividir entre la cantidad de notas (notas.length), no entre 2.',
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que imprimen el estado de un estudiante.',
          difficulty: 2,
          payload: {
            blocks: [
              'for (const e of estudiantes) {',
              '  const p: number = promedio(e.notas);',
              '  console.log(`${e.nombre} ${estado(p)}`);',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime por estudiante `nombre promedio estado`, con el promedio a 1 decimal. Aprueba con promedio mayor o igual a 6.',
          starterCode: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\ntype Estado = "aprobado" | "reprobado";\n\nfunction promedio(notas: number[]): number {\n  // TODO\n}\n\nfunction estado(prom: number): Estado {\n  // TODO\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\n`,
          solution: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\ntype Estado = "aprobado" | "reprobado";\n\nfunction promedio(notas: number[]): number {\n  let suma: number = 0;\n  for (const n of notas) {\n    suma += n;\n  }\n  return suma / notas.length;\n}\n\nfunction estado(prom: number): Estado {\n  return prom >= 6 ? 'aprobado' : 'reprobado';\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\nfor (const e of estudiantes) {\n  const p: number = promedio(e.notas);\n  console.log(\`\${e.nombre} \${p.toFixed(1)} \${estado(p)}\`);\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'Ana 8 6 7',
              expectedOutput: 'Ana 7.0 aprobado',
              isHidden: false,
            },
            {
              input: 'Luis 4 5\nEva 9 10',
              expectedOutput: 'Luis 4.5 reprobado\nEva 9.5 aprobado',
              isHidden: false,
            },
            {
              input: 'Zoe 6',
              expectedOutput: 'Zoe 6.0 aprobado',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime el nombre del estudiante con el mejor promedio (si hay empate, el que aparece primero).',
          starterCode: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\nfunction promedio(notas: number[]): number {\n  // TODO\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\n`,
          solution: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\nfunction promedio(notas: number[]): number {\n  let suma: number = 0;\n  for (const n of notas) {\n    suma += n;\n  }\n  return suma / notas.length;\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\nlet mejor: Estudiante = estudiantes[0];\nfor (const e of estudiantes) {\n  if (promedio(e.notas) > promedio(mejor.notas)) {\n    mejor = e;\n  }\n}\nconsole.log(mejor.nombre);\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'Ana 8 6 7\nLuis 9 9\nEva 5 5',
              expectedOutput: 'Luis',
              isHidden: false,
            },
            {
              input: 'Pedro 7 7\nSofia 7 7',
              expectedOutput: 'Pedro',
              isHidden: false,
            },
            { input: 'Zoe 10', expectedOutput: 'Zoe', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Cada línea es `nombre nota1 nota2 ...`. Imprime en una sola línea `aprobados reprobados` (cuántos estudiantes aprueban con promedio ≥ 6 y cuántos no).',
          starterCode: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\nfunction promedio(notas: number[]): number {\n  // TODO\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\n`,
          solution: `${ENTRADA}interface Estudiante {\n  nombre: string;\n  notas: number[];\n}\n\nfunction promedio(notas: number[]): number {\n  let suma: number = 0;\n  for (const n of notas) {\n    suma += n;\n  }\n  return suma / notas.length;\n}\n\nconst estudiantes: Estudiante[] = lineas.map((linea: string): Estudiante => {\n  const p: string[] = linea.split(' ');\n  return { nombre: p[0], notas: p.slice(1).map(Number) };\n});\nlet aprobados: number = 0;\nlet reprobados: number = 0;\nfor (const e of estudiantes) {\n  if (promedio(e.notas) >= 6) {\n    aprobados++;\n  } else {\n    reprobados++;\n  }\n}\nconsole.log(\`\${aprobados} \${reprobados}\`);\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'Ana 8 6 7\nLuis 4 5\nEva 9 10',
              expectedOutput: '2 1',
              isHidden: false,
            },
            { input: 'Zoe 3', expectedOutput: '0 1', isHidden: false },
            { input: 'A 6\nB 6\nC 5', expectedOutput: '2 1', isHidden: true },
          ],
        },
      ],
    },
  ],
};
