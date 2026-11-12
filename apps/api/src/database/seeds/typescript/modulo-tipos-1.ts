import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Módulo "Tipos en profundidad", lecciones 1-2.
export const tiposParte1: SeedLesson[] = [
  {
    title: 'Uniones y literales',
    xpReward: 10,
    contentMarkdown: md`
# Uniones y literales

A veces un valor puede ser de **más de un tipo**. TypeScript lo expresa con una **unión**, escrita con §|§ ("o").

## Uniones

§§§typescript
let id: number | string = 101;
id = "A-101"; // permitido
id = true; // Error: boolean no está en la unión
§§§

La variable puede cambiar entre los tipos de la unión, pero **solo** entre ellos.

## Tipos literales

Un tipo puede ser un **valor concreto**, no solo una categoría:

§§§typescript
let direccion: "norte" | "sur" | "este" | "oeste" = "norte";
direccion = "sur"; // permitido
direccion = "arriba"; // Error: "arriba" no es una de las opciones
§§§

Es ideal para valores que solo pueden ser unos pocos: estados, direcciones, operaciones, niveles…

## Por qué es útil

§§§typescript
function accion(color: "rojo" | "amarillo" | "verde"): string {
if (color === "rojo") return "detenerse";
if (color === "amarillo") return "precaucion";
return "avanzar";
}

accion("azul"); // Error antes de ejecutar
§§§

Una errata como §"verd"§ en vez de §"verde"§ se detecta al escribirla, no cuando un usuario descubra que el semáforo no funciona.

## Con arrays

§§§typescript
const mezcla: (number | string)[] = [1, "dos", 3];
§§§

Los paréntesis son necesarios: §number | string[]§ significaría otra cosa (un número o un array de textos).

## Recuerda

- §A | B§ = "A o B".
- Un literal como §"rojo"§ es un tipo que solo admite ese valor.
- Combinar literales con §|§ da un conjunto cerrado de opciones.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace el compilador con la última línea?',
        difficulty: 1,
        payload: {
          code: 'let id: number | string = 101;\nid = "A-101";\nid = true;',
          options: [
            'Todo es válido',
            'Marca un error en id = true',
            'Marca un error en id = "A-101"',
            'Convierte true en 1',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Cuál de estas asignaciones es válida?',
        difficulty: 1,
        payload: {
          code: 'let d: "norte" | "sur" | "este" | "oeste";',
          options: ['d = "arriba";', 'd = "Norte";', 'd = "este";', 'd = 1;'],
          correctIndex: 2,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué tipo tiene este array?',
        difficulty: 2,
        payload: {
          code: 'const mezcla: (number | string)[] = [1, "dos", 3];',
          options: [
            'Un array solo de números',
            'Un array donde cada elemento es number o string',
            'Un número o un array de textos',
            'any[]',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara `id` para que acepte un número o un texto.',
        difficulty: 1,
        payload: {
          template: 'let id: number {{0}} string = 5;',
          blanks: ['|'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'let nivel: "bajo" | "medio" | "alto" = "bajo";',
            'nivel = "medio";',
            'nivel = "extremo";',
            'console.log(nivel);',
          ],
          buggyLineIndex: 2,
          explanation:
            '"extremo" no es una de las opciones permitidas: solo "bajo", "medio" o "alto".',
        },
      },
      {
        type: 'sort',
        prompt: 'Ordena las líneas: declara la unión, asigna un valor y úsalo.',
        difficulty: 2,
        payload: {
          blocks: [
            'let estado: "on" | "off" = "off";',
            'estado = "on";',
            'console.log(estado);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un color de semáforo (`rojo`, `amarillo` o `verde`) e imprime `detenerse`, `precaucion` o `avanzar` usando la función `accion`.',
        starterCode: `${ENTRADA}type Color = "rojo" | "amarillo" | "verde";\n\nfunction accion(color: Color): string {\n  // TODO\n}\n\nconsole.log(accion(lineas[0] as Color));\n`,
        solution: `${ENTRADA}type Color = "rojo" | "amarillo" | "verde";\n\nfunction accion(color: Color): string {\n  if (color === "rojo") {\n    return "detenerse";\n  }\n  if (color === "amarillo") {\n    return "precaucion";\n  }\n  return "avanzar";\n}\n\nconsole.log(accion(lineas[0] as Color));\n`,
        difficulty: 1,
        testCases: [
          { input: 'rojo', expectedOutput: 'detenerse', isHidden: false },
          { input: 'amarillo', expectedOutput: 'precaucion', isHidden: false },
          { input: 'verde', expectedOutput: 'avanzar', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos números y una operación (`suma`, `resta` o `multiplica`), una por línea, e imprime el resultado.',
        starterCode: `${ENTRADA}type Operacion = "suma" | "resta" | "multiplica";\n\nfunction calcular(a: number, b: number, op: Operacion): number {\n  // TODO\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconst op = lineas[2] as Operacion;\n`,
        solution: `${ENTRADA}type Operacion = "suma" | "resta" | "multiplica";\n\nfunction calcular(a: number, b: number, op: Operacion): number {\n  if (op === "suma") {\n    return a + b;\n  }\n  if (op === "resta") {\n    return a - b;\n  }\n  return a * b;\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconst op = lineas[2] as Operacion;\nconsole.log(calcular(a, b, op));\n`,
        difficulty: 2,
        testCases: [
          { input: '6\n3\nsuma', expectedOutput: '9', isHidden: false },
          { input: '6\n3\nresta', expectedOutput: '3', isHidden: false },
          { input: '6\n3\nmultiplica', expectedOutput: '18', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Alias de tipos',
    xpReward: 10,
    contentMarkdown: md`
# Alias de tipos

Un **alias** le da nombre a un tipo con la palabra §type§. Sirve para no repetir tipos largos y para que el código se lea mejor.

## Alias simples

§§§typescript
type Id = number | string;
type Estado = "activo" | "inactivo" | "pendiente";

let usuario: Id = 7;
let cuenta: Estado = "activo";
§§§

Un alias **no crea un tipo nuevo**: es solo otro nombre para uno que ya existe.

## Alias de objetos

§§§typescript
type Punto = {
x: number;
y: number;
};

const origen: Punto = { x: 0, y: 0 };

function distancia(a: Punto, b: Punto): number {
const dx: number = a.x - b.x;
const dy: number = a.y - b.y;
return Math.sqrt(dx * dx + dy * dy);
}
§§§

## Alias de funciones

§§§typescript
type Operacion = (a: number, b: number) => number;

const suma: Operacion = (a, b) => a + b;
§§§

## Alias o interfaz

Para objetos, §type§ e §interface§ funcionan casi igual. Una regla sencilla:

- Usa **§interface§** para describir la forma de un objeto.
- Usa **§type§** para uniones, literales, funciones o cuando quieras ponerle nombre a cualquier tipo.

## Componer alias

§§§typescript
type Resultado = { ok: boolean; valor: number };
type Respuesta = Resultado | { ok: false; error: string };
§§§

Los alias pequeños se pueden combinar entre sí para construir tipos más grandes sin repetirte.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué hace la palabra `type` en este código?',
        difficulty: 1,
        payload: {
          code: 'type Id = number | string;',
          options: [
            'Crea una variable llamada Id',
            'Le da el nombre Id al tipo "number o string"',
            'Convierte un número en texto',
            'Importa un módulo',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué pasa con la última línea?',
        difficulty: 2,
        payload: {
          code: 'type Estado = "activo" | "inactivo";\nlet e: Estado = "activo";\ne = "suspendido";',
          options: [
            'Funciona',
            'Marca un error: "suspendido" no es un Estado',
            'e vale undefined',
            'Marca un error en la primera línea',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Crea un alias llamado `Punto` para un objeto con `x` e `y`.',
        difficulty: 1,
        payload: {
          template: '{{0}} Punto = {\n  x: number;\n  y: number;\n};',
          blanks: ['type'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'type Punto = { x: number; y: number };',
            'const a: Punto = { x: 1, y: 2 };',
            'const b: Punto = { x: 3 };',
            'console.log(a.x + b.x);',
          ],
          buggyLineIndex: 2,
          explanation: 'Al punto b le falta la propiedad y.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas: crea el alias, un valor de ese tipo y escríbelo.',
        difficulty: 2,
        payload: {
          blocks: [
            'type Etiqueta = string;',
            'const t: Etiqueta = "nuevo";',
            'console.log(t);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee dos puntos, cada uno en una línea como `x y`. Imprime la distancia entre ellos con 2 decimales.',
        starterCode: `${ENTRADA}type Punto = { x: number; y: number };\n\nfunction distancia(a: Punto, b: Punto): number {\n  // TODO\n}\n\nfunction leerPunto(linea: string): Punto {\n  const partes: number[] = linea.split(' ').map(Number);\n  return { x: partes[0], y: partes[1] };\n}\n\nconsole.log(distancia(leerPunto(lineas[0]), leerPunto(lineas[1])).toFixed(2));\n`,
        solution: `${ENTRADA}type Punto = { x: number; y: number };\n\nfunction distancia(a: Punto, b: Punto): number {\n  const dx: number = a.x - b.x;\n  const dy: number = a.y - b.y;\n  return Math.sqrt(dx * dx + dy * dy);\n}\n\nfunction leerPunto(linea: string): Punto {\n  const partes: number[] = linea.split(' ').map(Number);\n  return { x: partes[0], y: partes[1] };\n}\n\nconsole.log(distancia(leerPunto(lineas[0]), leerPunto(lineas[1])).toFixed(2));\n`,
        difficulty: 2,
        testCases: [
          { input: '0 0\n3 4', expectedOutput: '5.00', isHidden: false },
          { input: '1 1\n1 1', expectedOutput: '0.00', isHidden: false },
          { input: '-1 -1\n2 3', expectedOutput: '5.00', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos números `a` y `b`. Usa el alias `Resultado`: si `b` es 0 imprime `error`; si no, imprime `ok` y el cociente con 2 decimales, separados por un espacio.',
        starterCode: `${ENTRADA}type Resultado = { ok: boolean; valor: number };\n\nfunction dividir(a: number, b: number): Resultado {\n  // TODO\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\n`,
        solution: `${ENTRADA}type Resultado = { ok: boolean; valor: number };\n\nfunction dividir(a: number, b: number): Resultado {\n  if (b === 0) {\n    return { ok: false, valor: 0 };\n  }\n  return { ok: true, valor: a / b };\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconst r: Resultado = dividir(a, b);\nif (r.ok) {\n  console.log(\`ok \${r.valor.toFixed(2)}\`);\n} else {\n  console.log('error');\n}\n`,
        difficulty: 3,
        testCases: [
          { input: '10\n4', expectedOutput: 'ok 2.50', isHidden: false },
          { input: '5\n0', expectedOutput: 'error', isHidden: false },
          { input: '1\n3', expectedOutput: 'ok 0.33', isHidden: true },
        ],
      },
    ],
  },
];
