import type { SeedLesson } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

// Fundamentos, lecciones 1-3. Order here is the order in the app.
export const fundamentosParte1: SeedLesson[] = [
  {
    title: 'Variables y tipos explícitos',
    xpReward: 10,
    contentMarkdown: md`
# Variables y tipos explícitos

TypeScript es JavaScript con una capa extra: los **tipos**. Un tipo dice qué clase de valor puede guardar una variable (texto, número, verdadero/falso…) y el compilador lo comprueba **antes** de ejecutar el programa.

## Declarar variables

§§§typescript
let contador: number = 0;
const nombre: string = "Ana";
§§§

- §let§ crea una variable cuyo valor puede cambiar.
- §const§ crea una variable que no se puede reasignar.
- Después del nombre va §: tipo§. Se llama **anotación de tipo**.

## El compilador te cuida

§§§typescript
let edad: number = 20;
edad = "veinte"; // Error: Type 'string' is not assignable to type 'number'.
§§§

En JavaScript esa línea funcionaría y fallaría más adelante, quizá en otro lugar. En TypeScript el error aparece **antes de correr el programa**, justo en la línea del problema. En esta app, si tu código tiene un error de tipos, no se ejecuta y ves el mensaje del compilador.

## Inferencia

No siempre hace falta anotar: si inicializas la variable, TypeScript deduce el tipo.

§§§typescript
let ciudad = "Cali"; // TypeScript deduce: string
ciudad = 5; // Error
§§§

Una buena costumbre al empezar: **anota los tipos explícitamente** hasta que te resulte natural. Así practicas y el código se explica solo.

## Recuerda

- El tipo se escribe en minúscula: §string§, §number§, §boolean§.
- Un nombre = un tipo. No puedes cambiarlo a mitad del programa.
- El error del compilador te dice qué tipo se esperaba y cuál recibió.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué pasa con este código?',
        difficulty: 1,
        payload: {
          code: 'let edad: number = "veinte";',
          options: [
            'Funciona y edad vale "veinte"',
            'El compilador marca un error de tipos',
            'Convierte "veinte" a 20',
            'Imprime undefined',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué tipo deduce TypeScript para `ciudad`?',
        difficulty: 1,
        payload: {
          code: 'let ciudad = "Cali";',
          options: ['number', 'boolean', 'string', 'any'],
          correctIndex: 2,
        },
      },
      {
        type: 'fill',
        prompt: 'Declara `precio` como una variable de tipo número.',
        difficulty: 1,
        payload: {
          template: 'let precio{{0}} {{1}} = 9.99;',
          blanks: [':', 'number'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador marca un error de tipos. ¿Qué línea lo causa?',
        difficulty: 2,
        payload: {
          lines: [
            'let total: number = 0;',
            'let nombre: string = "Ana";',
            'total = nombre;',
            'console.log(total);',
          ],
          buggyLineIndex: 2,
          explanation:
            '`total` es un number y `nombre` es un string: no se puede asignar un texto a una variable numérica.',
        },
      },
      {
        type: 'sort',
        prompt:
          'Ordena las líneas para calcular e imprimir el doble de un número.',
        difficulty: 1,
        payload: {
          blocks: [
            'const n: number = 4;',
            'const doble: number = n * 2;',
            'console.log(doble);',
          ],
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un nombre (línea 1) y una edad (línea 2). Imprime `Hola, <nombre>. Tienes <edad> años.`',
        starterCode: `${ENTRADA}const nombre: string = lineas[0];\nconst edad: number = Number(lineas[1]);\n`,
        solution: `${ENTRADA}const nombre: string = lineas[0];\nconst edad: number = Number(lineas[1]);\nconsole.log(\`Hola, \${nombre}. Tienes \${edad} años.\`);\n`,
        difficulty: 1,
        testCases: [
          {
            input: 'Ana\n20',
            expectedOutput: 'Hola, Ana. Tienes 20 años.',
            isHidden: false,
          },
          {
            input: 'Luis\n31',
            expectedOutput: 'Hola, Luis. Tienes 31 años.',
            isHidden: true,
          },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos números (uno por línea) y imprime su suma. Usa variables con tipo `number`.',
        starterCode: `${ENTRADA}const a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\n`,
        solution: `${ENTRADA}const a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconst suma: number = a + b;\nconsole.log(suma);\n`,
        difficulty: 1,
        testCases: [
          { input: '2\n3', expectedOutput: '5', isHidden: false },
          { input: '10\n-4', expectedOutput: '6', isHidden: false },
          { input: '1.5\n2.5', expectedOutput: '4', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Tipos básicos y anotaciones',
    xpReward: 10,
    contentMarkdown: md`
# Tipos básicos y anotaciones

Estos son los tipos con los que vas a trabajar casi siempre:

| Tipo        | Qué guarda          | Ejemplo             |
| ----------- | ------------------- | ------------------- |
| §string§    | texto               | §"hola"§, §'mundo'§ |
| §number§    | cualquier número    | §42§, §3.14§, §-7§  |
| §boolean§   | verdadero o falso   | §true§, §false§     |
| §null§      | "a propósito, nada" | §null§              |
| §undefined§ | "todavía sin valor" | §undefined§         |

En TypeScript solo hay **un** tipo para los números: §number§ vale tanto para enteros como para decimales.

## Anotar variables

§§§typescript
const titulo: string = "CodeQuest";
const nivel: number = 3;
const activo: boolean = true;
§§§

## Convertir entre tipos

Los datos que llegan de la entrada son siempre texto. Hay que convertirlos tú:

§§§typescript
const entrada: string = "42";
const n: number = Number(entrada); // 42
const texto: string = String(n); // "42"
§§§

TypeScript no convierte por ti: si intentas §n + entrada§ te avisará del problema.

## El tipo §any§: úsalo con cuidado

§§§typescript
let cualquiera: any = 5;
cualquiera = "hola"; // permitido... y sin ninguna protección
§§§

§any§ apaga la comprobación de tipos. Es una salida de emergencia, no un tipo normal: si lo usas, pierdes justo lo que TypeScript te da.

## Plantillas de texto

Las comillas invertidas permiten insertar valores con §\${ }§:

§§§typescript
const nombre: string = "Ana";
console.log(\`Hola, \${nombre}\`);
§§§
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué tipo anotarías para `3.14`?',
        difficulty: 1,
        payload: {
          code: 'const pi: ____ = 3.14;',
          options: ['float', 'number', 'decimal', 'double'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué pasa con este código?',
        difficulty: 1,
        payload: {
          code: 'const activo: boolean = "true";',
          options: [
            'Funciona: "true" se convierte en true',
            'Error: un string no es un boolean',
            'Imprime true',
            'Error de ejecución en la línea siguiente',
          ],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 2,
        payload: {
          code: 'const entrada: string = "5";\nconst n: number = Number(entrada);\nconsole.log(n + 1);',
          options: ['"51"', '6', '51', 'NaN'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt: 'Convierte el texto `entrada` a número.',
        difficulty: 1,
        payload: {
          template: 'const n: number = {{0}}(entrada);',
          blanks: ['Number'],
        },
      },
      {
        type: 'bug',
        prompt: 'El compilador protesta. ¿Qué línea tiene el error de tipos?',
        difficulty: 2,
        payload: {
          lines: [
            'const nombre: string = "Luz";',
            'const edad: number = 25;',
            'const activo: boolean = "si";',
            'console.log(nombre, edad, activo);',
          ],
          buggyLineIndex: 2,
          explanation:
            'Un boolean solo puede ser true o false; "si" es un string.',
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un texto e imprime el texto en mayúsculas, un espacio y su longitud. Ejemplo: `hola` → `HOLA 4`.',
        starterCode: `${ENTRADA}const texto: string = lineas[0];\n`,
        solution: `${ENTRADA}const texto: string = lineas[0];\nconsole.log(\`\${texto.toUpperCase()} \${texto.length}\`);\n`,
        difficulty: 1,
        testCases: [
          { input: 'hola', expectedOutput: 'HOLA 4', isHidden: false },
          {
            input: 'TypeScript',
            expectedOutput: 'TYPESCRIPT 10',
            isHidden: false,
          },
          { input: 'a', expectedOutput: 'A 1', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee dos notas (una por línea) e imprime su promedio con 1 decimal (`toFixed(1)`).',
        starterCode: `${ENTRADA}const nota1: number = Number(lineas[0]);\nconst nota2: number = Number(lineas[1]);\n`,
        solution: `${ENTRADA}const nota1: number = Number(lineas[0]);\nconst nota2: number = Number(lineas[1]);\nconst promedio: number = (nota1 + nota2) / 2;\nconsole.log(promedio.toFixed(1));\n`,
        difficulty: 2,
        testCases: [
          { input: '4\n5', expectedOutput: '4.5', isHidden: false },
          { input: '3\n3', expectedOutput: '3.0', isHidden: false },
          { input: '2.5\n4', expectedOutput: '3.3', isHidden: true },
        ],
      },
    ],
  },
  {
    title: 'Condicionales',
    xpReward: 10,
    contentMarkdown: md`
# Condicionales

Un condicional decide qué código ejecutar según se cumpla o no una condición.

## if, else if, else

§§§typescript
const nota: number = 7;

if (nota >= 9) {
console.log("Excelente");
} else if (nota >= 6) {
console.log("Aprobado");
} else {
console.log("Por mejorar");
}
§§§

Se evalúan en orden y se ejecuta **solo el primer bloque** cuya condición sea verdadera.

## Comparaciones

| Operador          | Significa            |
| ----------------- | -------------------- |
| §===§             | igual (valor y tipo) |
| §!==§             | distinto             |
| §>§ §<§ §>=§ §<=§ | mayor, menor…        |

Usa siempre §===§ y §!==§. Comparar un §number§ con un §string§ con §===§ ni siquiera compila: TypeScript te avisa del descuido.

## Combinar condiciones

- §&&§ (y): las dos deben cumplirse.
- §||§ (o): basta con una.
- §!§ (no): invierte el resultado.

§§§typescript
const edad: number = 20;
const tieneCarnet: boolean = true;
const puedeEntrar: boolean = edad >= 18 && tieneCarnet;
§§§

## Operador ternario

Una forma corta de elegir entre dos valores:

§§§typescript
const estado: string = edad >= 18 ? "adulto" : "menor";
§§§

## Recuerda

- El resultado de una comparación es un §boolean§.
- El tipo de cada rama debe encajar con la variable que lo recibe.
    `,
    exercises: [
      {
        type: 'quiz',
        prompt: '¿Qué imprime este código?',
        difficulty: 1,
        payload: {
          code: 'const nota: number = 7;\nif (nota >= 9) {\n  console.log("A");\n} else if (nota >= 6) {\n  console.log("B");\n} else {\n  console.log("C");\n}',
          options: ['A', 'B', 'C', 'B y C'],
          correctIndex: 1,
        },
      },
      {
        type: 'quiz',
        prompt: '¿Cuál es el valor de `puede`?',
        difficulty: 2,
        payload: {
          code: 'const edad: number = 17;\nconst permiso: boolean = true;\nconst puede: boolean = edad >= 18 && permiso;',
          options: ['true', 'false', '17', 'undefined'],
          correctIndex: 1,
        },
      },
      {
        type: 'fill',
        prompt:
          'Completa el ternario para que `estado` sea "adulto" o "menor".',
        difficulty: 2,
        payload: {
          template:
            'const estado: string = edad >= 18 {{0}} "adulto" {{1}} "menor";',
          blanks: ['?', ':'],
        },
      },
      {
        type: 'bug',
        prompt: 'Este código nunca imprime "par". ¿Qué línea tiene el error?',
        difficulty: 2,
        payload: {
          lines: [
            'const n: number = 4;',
            'if (n % 2 === 1) {',
            '  console.log("par");',
            '} else {',
            '  console.log("impar");',
            '}',
          ],
          buggyLineIndex: 1,
          explanation:
            'Un número par deja resto 0 al dividir entre 2: la condición debe ser n % 2 === 0.',
        },
      },
      {
        type: 'code',
        prompt:
          'Lee un número e imprime `par` si es par o `impar` si no lo es.',
        starterCode: `${ENTRADA}const n: number = Number(lineas[0]);\n`,
        solution: `${ENTRADA}const n: number = Number(lineas[0]);\nif (n % 2 === 0) {\n  console.log("par");\n} else {\n  console.log("impar");\n}\n`,
        difficulty: 1,
        testCases: [
          { input: '4', expectedOutput: 'par', isHidden: false },
          { input: '7', expectedOutput: 'impar', isHidden: false },
          { input: '0', expectedOutput: 'par', isHidden: true },
        ],
      },
      {
        type: 'code',
        prompt:
          'Lee una nota. Imprime `Excelente` si es 9 o más, `Aprobado` si es 6 o más, y `Por mejorar` en otro caso.',
        starterCode: `${ENTRADA}const nota: number = Number(lineas[0]);\n`,
        solution: `${ENTRADA}const nota: number = Number(lineas[0]);\nif (nota >= 9) {\n  console.log("Excelente");\n} else if (nota >= 6) {\n  console.log("Aprobado");\n} else {\n  console.log("Por mejorar");\n}\n`,
        difficulty: 2,
        testCases: [
          { input: '10', expectedOutput: 'Excelente', isHidden: false },
          { input: '7', expectedOutput: 'Aprobado', isHidden: false },
          { input: '3', expectedOutput: 'Por mejorar', isHidden: false },
          { input: '6', expectedOutput: 'Aprobado', isHidden: true },
        ],
      },
    ],
  },
];
