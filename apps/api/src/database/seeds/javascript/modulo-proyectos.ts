import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

// Reads the whole text (one line), lowercases it and strips punctuation —
// shared by every exercise of the word-counter project.
const TEXTO_NORMALIZADO = `${LINEAS}const palabras = lineas[0]\n  .toLowerCase()\n  .replace(/[.,;:!?¿¡]/g, '')\n  .split(' ')\n  .filter((palabra) => palabra !== '');\n`;

const CONTEO = `const conteo = {};\nfor (const palabra of palabras) {\n  conteo[palabra] = (conteo[palabra] ?? 0) + 1;\n}\n`;

// Reads "n" and then n lines of "nombre nota".
const ESTUDIANTES = `${LINEAS}const n = parseInt(lineas[0], 10);\nconst estudiantes = lineas.slice(1, n + 1).map((linea) => {\n  const [nombre, nota] = linea.split(' ');\n  return [nombre, parseInt(nota, 10)];\n});\n`;

export const moduloProyectos: SeedModule = {
  title: 'Mini proyectos',
  lessons: [
    {
      title: 'Proyecto: calculadora',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: calculadora

Vas a construir una calculadora de consola **por etapas**, igual que se hace en un proyecto real: primero que funcione lo básico, después que sea robusta, al final que sea cómoda de usar.

## Etapa 1 — Una operación

La entrada es una línea con el formato §número operador número§, por ejemplo §10 / 4§. Para separarla:

§§§javascript
const [a, op, b] = lineas[0].split(' '); // "10 / 4" -> "10", "/", "4"
const x = parseInt(a, 10);
const y = parseInt(b, 10);
§§§

Luego decide qué hacer según §op§ con §if§ / §else if§ (o con un §switch§).

Para redondear a 2 decimales **sin** dejar ceros sobrantes: §Math.round(valor * 100) / 100§ (así §4§ se muestra como §4§, no §4.00§).

## Etapa 2 — Casos especiales

Un buen programa piensa en lo que **puede salir mal**:

- Un operador que no existe (§%§, §x§…).
- Dividir entre cero (en JavaScript no da error, da §Infinity§: hay que comprobarlo).

## Etapa 3 — Muchas operaciones

La entrada trae varias líneas hasta que aparezca §salir§:

§§§javascript
for (const linea of lineas) {
if (linea === "salir") {
break;
}
// ... calcular e imprimir ...
}
§§§

## Etapa 4 — Acumular

Una calculadora real "recuerda" el resultado anterior. Empezarás con un número y le irás aplicando operaciones.

**Consejo:** mete la lógica de calcular en una **función** (§calcular(a, op, b)§) y reutilízala en cada etapa.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué valor guarda `partes`?',
          difficulty: 1,
          payload: {
            code: 'const partes = "10 + 5".split(" ");\nconsole.log(partes);',
            options: [
              "[ '10 + 5' ]",
              "[ '10', '+', '5' ]",
              "[ '1', '0', '+', '5' ]",
              '10 + 5',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué imprime este código? (en JavaScript dividir entre cero no lanza error)',
          difficulty: 2,
          payload: {
            code: 'console.log(5 / 0);',
            options: ['0', 'Infinity', 'NaN', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'code',
          prompt:
            'Etapa 1. Lee una línea `a op b` con enteros y uno de los operadores `+`, `-`, `*`, `/`. Imprime el resultado (en la división, redondeado a 2 decimales con `Math.round(valor * 100) / 100`).',
          starterCode: `${LINEAS}const [a, op, b] = lineas[0].split(' ');\nconst x = parseInt(a, 10);\nconst y = parseInt(b, 10);\n`,
          solution: `${LINEAS}const [a, op, b] = lineas[0].split(' ');\nconst x = parseInt(a, 10);\nconst y = parseInt(b, 10);\nif (op === '+') {\n  console.log(x + y);\n} else if (op === '-') {\n  console.log(x - y);\n} else if (op === '*') {\n  console.log(x * y);\n} else if (op === '/') {\n  console.log(Math.round((x / y) * 100) / 100);\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '3 + 4', expectedOutput: '7', isHidden: false },
            { input: '10 - 15', expectedOutput: '-5', isHidden: false },
            { input: '6 * 7', expectedOutput: '42', isHidden: false },
            { input: '10 / 4', expectedOutput: '2.5', isHidden: true },
            { input: '9 / 3', expectedOutput: '3', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 2. Igual que antes, pero: si el operador no es `+ - * /` imprime `operacion invalida`, y si divides entre cero imprime `no se puede dividir entre cero`.',
          starterCode: `${LINEAS}const [a, op, b] = lineas[0].split(' ');\nconst x = parseInt(a, 10);\nconst y = parseInt(b, 10);\n`,
          solution: `${LINEAS}const [a, op, b] = lineas[0].split(' ');\nconst x = parseInt(a, 10);\nconst y = parseInt(b, 10);\nif (op === '+') {\n  console.log(x + y);\n} else if (op === '-') {\n  console.log(x - y);\n} else if (op === '*') {\n  console.log(x * y);\n} else if (op === '/') {\n  if (y === 0) {\n    console.log('no se puede dividir entre cero');\n  } else {\n    console.log(Math.round((x / y) * 100) / 100);\n  }\n} else {\n  console.log('operacion invalida');\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '2 + 2', expectedOutput: '4', isHidden: false },
            {
              input: '5 / 0',
              expectedOutput: 'no se puede dividir entre cero',
              isHidden: false,
            },
            {
              input: '5 % 2',
              expectedOutput: 'operacion invalida',
              isHidden: false,
            },
            { input: '8 / 2', expectedOutput: '4', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 3. Define `calcular(a, op, b)` que devuelva el resultado (o el mensaje de error de la etapa 2). Las líneas de entrada son `a op b`, hasta que llegue `salir`; imprime el resultado de cada una.',
          starterCode: `function calcular(a, op, b) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}for (const linea of lineas) {\n  if (linea === 'salir') {\n    break;\n  }\n  const [a, op, b] = linea.split(' ');\n  console.log(calcular(parseInt(a, 10), op, parseInt(b, 10)));\n}\n`,
          solution: `function calcular(a, op, b) {\n  if (op === '+') {\n    return a + b;\n  }\n  if (op === '-') {\n    return a - b;\n  }\n  if (op === '*') {\n    return a * b;\n  }\n  if (op === '/') {\n    if (b === 0) {\n      return 'no se puede dividir entre cero';\n    }\n    return Math.round((a / b) * 100) / 100;\n  }\n  return 'operacion invalida';\n}\n\n${LINEAS}for (const linea of lineas) {\n  if (linea === 'salir') {\n    break;\n  }\n  const [a, op, b] = linea.split(' ');\n  console.log(calcular(parseInt(a, 10), op, parseInt(b, 10)));\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '1 + 1\n2 * 3\nsalir',
              expectedOutput: '2\n6',
              isHidden: false,
            },
            {
              input: '4 / 0\n9 - 10\nsalir',
              expectedOutput: 'no se puede dividir entre cero\n-1',
              isHidden: false,
            },
            { input: 'salir', expectedOutput: '', isHidden: true },
            {
              input: '7 ^ 2\n8 / 2\nsalir',
              expectedOutput: 'operacion invalida\n4',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 4. La primera línea es un número inicial. Cada línea siguiente es `operador número` (`+`, `-` o `*`) y se aplica al resultado acumulado. Termina con `salir` e imprime el resultado final.',
          starterCode: `${LINEAS}let total = parseInt(lineas[0], 10);\n`,
          solution: `${LINEAS}let total = parseInt(lineas[0], 10);\nfor (const linea of lineas.slice(1)) {\n  if (linea === 'salir') {\n    break;\n  }\n  const [op, valor] = linea.split(' ');\n  const n = parseInt(valor, 10);\n  if (op === '+') {\n    total += n;\n  } else if (op === '-') {\n    total -= n;\n  } else if (op === '*') {\n    total *= n;\n  }\n}\nconsole.log(total);\n`,
          difficulty: 3,
          testCases: [
            {
              input: '10\n+ 5\n* 2\nsalir',
              expectedOutput: '30',
              isHidden: false,
            },
            { input: '5\n- 10\nsalir', expectedOutput: '-5', isHidden: false },
            { input: '3\nsalir', expectedOutput: '3', isHidden: true },
            {
              input: '2\n* 5\n* 5\n- 1\nsalir',
              expectedOutput: '49',
              isHidden: true,
            },
          ],
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas del bucle principal: recorrer las líneas hasta que aparezca `salir`.',
          difficulty: 2,
          payload: {
            blocks: [
              'for (const linea of lineas) {',
              '  if (linea === "salir") {',
              '    break;',
              '  }',
              '  console.log(linea);',
              '}',
            ],
          },
        },
      ],
    },
    {
      title: 'Proyecto: adivina el número',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: adivina el número

Un clásico: el programa guarda un número secreto y la persona intenta adivinarlo, recibiendo pistas.

Para que los ejercicios sean comprobables, el número secreto llega en la **primera línea de entrada** y los intentos en las siguientes.

## Etapa 1 — Un intento

Compara y da una pista:

§§§javascript
const secreto = parseInt(lineas[0], 10);
const intento = parseInt(lineas[1], 10);

if (intento > secreto) {
console.log("muy alto");
} else if (intento < secreto) {
console.log("muy bajo");
} else {
console.log("correcto");
}
§§§

## Etapa 2 — Repetir hasta acertar

Necesitas un bucle y un **contador de intentos**:

§§§javascript
let intentos = 0;
for (const linea of lineas.slice(1)) {
const intento = parseInt(linea, 10);
intentos++;
if (intento === secreto) {
break;
}
// pista ...
}
§§§

Un detalle de lenguaje: "1 intento", pero "3 intentos". Un pequeño operador ternario (§condición ? a : b§) resuelve el plural.

## Etapa 3 — Un límite de intentos

Un juego sin final no es divertido. Con un contador y una variable "acertó" puedes limitar las vueltas:

§§§javascript
let acerto = false;
for (let numero = 1; numero <= 5 && !acerto; numero++) {
// leer intento número "numero" ...
}
if (!acerto) {
console.log("perdiste");
}
§§§

**Idea para ampliar:** que el programa elija el secreto con §Math.floor(Math.random() * 100) + 1§ para jugar tú mismo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'const n = 1;\nconsole.log(n === 1 ? "intento" : "intentos");',
            options: ['intento', 'intentos', 'true', 'undefined'],
            correctIndex: 0,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa las pistas del juego.',
          difficulty: 1,
          payload: {
            template:
              'if (intento {{0}} secreto) {\n  console.log("muy alto");\n} {{1}} if (intento < secreto) {\n  console.log("muy bajo");\n} else {\n  console.log("correcto");\n}',
            blanks: ['>', 'else'],
          },
        },
        {
          type: 'code',
          prompt:
            'Etapa 1. Lee el número secreto y un intento (uno por línea). Imprime `muy alto`, `muy bajo` o `correcto`.',
          starterCode: `${LINEAS}const secreto = parseInt(lineas[0], 10);\nconst intento = parseInt(lineas[1], 10);\n`,
          solution: `${LINEAS}const secreto = parseInt(lineas[0], 10);\nconst intento = parseInt(lineas[1], 10);\nif (intento > secreto) {\n  console.log('muy alto');\n} else if (intento < secreto) {\n  console.log('muy bajo');\n} else {\n  console.log('correcto');\n}\n`,
          difficulty: 1,
          testCases: [
            { input: '7\n9', expectedOutput: 'muy alto', isHidden: false },
            { input: '7\n3', expectedOutput: 'muy bajo', isHidden: false },
            { input: '7\n7', expectedOutput: 'correcto', isHidden: false },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 2. La primera línea es el secreto; las siguientes son intentos, hasta acertar. Por cada intento fallido imprime `muy alto` o `muy bajo`. Al acertar imprime `correcto en N intento` (o `intentos` si N es mayor que 1).',
          starterCode: `${LINEAS}const secreto = parseInt(lineas[0], 10);\nlet intentos = 0;\n`,
          solution: `${LINEAS}const secreto = parseInt(lineas[0], 10);\nlet intentos = 0;\nfor (const linea of lineas.slice(1)) {\n  const intento = parseInt(linea, 10);\n  intentos++;\n  if (intento === secreto) {\n    break;\n  }\n  console.log(intento > secreto ? 'muy alto' : 'muy bajo');\n}\nconsole.log('correcto en ' + intentos + (intentos === 1 ? ' intento' : ' intentos'));\n`,
          difficulty: 3,
          testCases: [
            {
              input: '7\n3\n9\n7',
              expectedOutput: 'muy bajo\nmuy alto\ncorrecto en 3 intentos',
              isHidden: false,
            },
            {
              input: '5\n5',
              expectedOutput: 'correcto en 1 intento',
              isHidden: false,
            },
            {
              input: '10\n20\n15\n12\n10',
              expectedOutput:
                'muy alto\nmuy alto\nmuy alto\ncorrecto en 4 intentos',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Etapa 3. Igual que la etapa 2, pero hay un máximo de 5 intentos. Si aciertas imprime `correcto en N intento(s)` como antes; si fallas los 5, imprime `perdiste, era X` (con el secreto) y no proceses más intentos.',
          starterCode: `${LINEAS}const secreto = parseInt(lineas[0], 10);\n`,
          solution: `${LINEAS}const secreto = parseInt(lineas[0], 10);\nlet acerto = false;\nfor (let numero = 1; numero <= 5 && !acerto; numero++) {\n  const intento = parseInt(lineas[numero], 10);\n  if (intento === secreto) {\n    acerto = true;\n    console.log('correcto en ' + numero + (numero === 1 ? ' intento' : ' intentos'));\n  } else {\n    console.log(intento > secreto ? 'muy alto' : 'muy bajo');\n  }\n}\nif (!acerto) {\n  console.log('perdiste, era ' + secreto);\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '4\n1\n4',
              expectedOutput: 'muy bajo\ncorrecto en 2 intentos',
              isHidden: false,
            },
            {
              input: '4\n1\n2\n3\n5\n6',
              expectedOutput:
                'muy bajo\nmuy bajo\nmuy bajo\nmuy alto\nmuy alto\nperdiste, era 4',
              isHidden: false,
            },
            {
              input: '8\n8',
              expectedOutput: 'correcto en 1 intento',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Este bucle debería permitir 5 intentos, pero nunca termina. ¿Qué línea del bucle falla?',
          difficulty: 2,
          payload: {
            lines: [
              'let intentos = 0;',
              'while (intentos < 5) {',
              '  const intento = parseInt(lineas[intentos + 1], 10);',
              '  console.log("probaste", intento);',
              '}',
            ],
            buggyLineIndex: 3,
            explanation:
              'Dentro del bucle falta aumentar el contador (`intentos++`); sin eso `intentos < 5` siempre es verdadero y el bucle no termina.',
          },
        },
      ],
    },
    {
      title: 'Proyecto: notas de estudiantes',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: notas de estudiantes

Un programa para el profesor: recibe las notas de un grupo y genera estadísticas.

**Formato de entrada:** la primera línea es la cantidad §n§ de estudiantes; después hay §n§ líneas con §nombre nota§ (la nota es un entero):

§§§text
3
Ana 80
Luis 90
Eva 70
§§§

## Leer los datos

Una buena estructura para guardar esto es un **array de pares** §[nombre, nota]§:

§§§javascript
const n = parseInt(lineas[0], 10);
const estudiantes = lineas.slice(1, n + 1).map((linea) => {
const [nombre, nota] = linea.split(" ");
return [nombre, parseInt(nota, 10)];
});
§§§

Con §estudiantes§ puedes aplicar casi todo lo aprendido:

- **Promedio:** §estudiantes.reduce((s, [, nota]) => s + nota, 0) / n§
- **Mejor nota:** §estudiantes.reduce((mejor, e) => (e[1] > mejor[1] ? e : mejor))§
- **Ordenar:** §[...estudiantes].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))§ — por nota descendente y, en empate, por nombre.

## Pasos de la lección

1. Promedio del grupo.
2. Mejor estudiante.
3. Cuántos aprobaron (nota mínima 60).
4. Letra de cada estudiante (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F menos de 60).
5. Un ranking numerado.

Al terminar tendrás un programa que combina entrada, arrays, funciones y formato: justo lo que se pide en programas reales.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'const [nombre, nota] = "Ana 90".split(" ");\nconsole.log(nota + 1);',
            options: ['91', '901', 'Ana1', 'NaN'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué imprime este código? (`||` devuelve el primer valor "truthy")',
          difficulty: 3,
          payload: {
            code: 'const a = ["Zoe", 80];\nconst b = ["Ana", 80];\nconsole.log(b[1] - a[1] || a[0].localeCompare(b[0]));',
            options: ['0', '1', '-1', 'NaN'],
            correctIndex: 1,
          },
        },
        {
          type: 'code',
          prompt:
            'Lee `n` y luego `n` líneas `nombre nota`. Imprime el promedio de las notas redondeado a 2 decimales (con `Math.round(valor * 100) / 100`).',
          starterCode: ESTUDIANTES,
          solution: `${ESTUDIANTES}const suma = estudiantes.reduce((total, [, nota]) => total + nota, 0);\nconsole.log(Math.round((suma / n) * 100) / 100);\n`,
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: '80',
              isHidden: false,
            },
            { input: '1\nSol 55', expectedOutput: '55', isHidden: false },
            { input: '2\nA 90\nB 85', expectedOutput: '87.5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato de entrada, imprime el estudiante con la nota más alta como `nombre nota`. Si hay empate, el que aparece primero.',
          starterCode: ESTUDIANTES,
          solution: `${ESTUDIANTES}const mejor = estudiantes.reduce((actual, e) => (e[1] > actual[1] ? e : actual));\nconsole.log(mejor[0], mejor[1]);\n`,
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: 'Luis 90',
              isHidden: false,
            },
            { input: '2\nA 50\nB 50', expectedOutput: 'A 50', isHidden: false },
            { input: '1\nSol 100', expectedOutput: 'Sol 100', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime `aprobados: X de N`, donde X es la cantidad de estudiantes con nota 60 o más.',
          starterCode: ESTUDIANTES,
          solution: `${ESTUDIANTES}const aprobados = estudiantes.filter(([, nota]) => nota >= 60).length;\nconsole.log('aprobados: ' + aprobados + ' de ' + n);\n`,
          difficulty: 2,
          testCases: [
            {
              input: '3\nAna 80\nLuis 59\nEva 60',
              expectedOutput: 'aprobados: 2 de 3',
              isHidden: false,
            },
            {
              input: '2\nA 10\nB 20',
              expectedOutput: 'aprobados: 0 de 2',
              isHidden: false,
            },
            {
              input: '1\nSol 100',
              expectedOutput: 'aprobados: 1 de 1',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime una línea `nombre: letra` por estudiante, en el orden de entrada. Letras: A (90 o más), B (80-89), C (70-79), D (60-69), F (menos de 60). Define una función `letra(nota)`.',
          starterCode: `function letra(nota) {\n  // Escribe tu código aquí\n}\n\n${ESTUDIANTES}for (const [nombre, nota] of estudiantes) {\n  console.log(nombre + ': ' + letra(nota));\n}\n`,
          solution: `function letra(nota) {\n  if (nota >= 90) {\n    return 'A';\n  }\n  if (nota >= 80) {\n    return 'B';\n  }\n  if (nota >= 70) {\n    return 'C';\n  }\n  if (nota >= 60) {\n    return 'D';\n  }\n  return 'F';\n}\n\n${ESTUDIANTES}for (const [nombre, nota] of estudiantes) {\n  console.log(nombre + ': ' + letra(nota));\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '3\nAna 95\nLuis 82\nEva 55',
              expectedOutput: 'Ana: A\nLuis: B\nEva: F',
              isHidden: false,
            },
            {
              input: '2\nA 70\nB 60',
              expectedOutput: 'A: C\nB: D',
              isHidden: false,
            },
            {
              input: '2\nC 90\nD 79',
              expectedOutput: 'C: A\nD: C',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo formato, imprime un ranking numerado desde 1 con el formato `1. Ana 90`, ordenado por nota de mayor a menor. Si hay empate, por nombre en orden alfabético.',
          starterCode: ESTUDIANTES,
          solution: `${ESTUDIANTES}const ranking = [...estudiantes].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));\nranking.forEach(([nombre, nota], i) => {\n  console.log(String(i + 1) + '. ' + nombre + ' ' + nota);\n});\n`,
          difficulty: 3,
          testCases: [
            {
              input: '3\nAna 80\nLuis 90\nEva 70',
              expectedOutput: '1. Luis 90\n2. Ana 80\n3. Eva 70',
              isHidden: false,
            },
            {
              input: '3\nZoe 80\nAna 80\nMax 95',
              expectedOutput: '1. Max 95\n2. Ana 80\n3. Zoe 80',
              isHidden: false,
            },
            { input: '1\nSol 10', expectedOutput: '1. Sol 10', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Debería calcular el promedio, pero imprime `NaN` al final. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'const notas = [80, 90, 70];',
              'let suma = 0;',
              'for (const nota of notas) {',
              '  suma += nota;',
              '}',
              'console.log(suma / nota.length);',
            ],
            buggyLineIndex: 5,
            explanation:
              '`nota.length` usa la variable del bucle, que ni siquiera existe fuera de él (ReferenceError en este caso); la cantidad de elementos es `notas.length`.',
          },
        },
      ],
    },
    {
      title: 'Proyecto: contador de palabras',
      xpReward: 20,
      contentMarkdown: md`
# Proyecto: contador de palabras

Analizar texto es una de las tareas más comunes en programación: buscadores, redes sociales, estadísticas. Aquí construirás un contador de frecuencias de palabras con **objetos**.

## Limpiar el texto

Para que "Hola," y "hola" cuenten como la misma palabra hay que **normalizar**: pasar a minúsculas y quitar signos de puntuación con una expresión regular.

§§§javascript
const palabras = lineas[0]
.toLowerCase()
.replace(/[.,;:!?¿¡]/g, "")
.split(" ")
.filter((palabra) => palabra !== "");
§§§

§/[.,;:!?¿¡]/g§ significa "cualquiera de estos signos, en todo el texto".

## Contar con un objeto

§§§javascript
const conteo = {};
for (const palabra of palabras) {
conteo[palabra] = (conteo[palabra] ?? 0) + 1;
}
§§§

§conteo[palabra] ?? 0§ devuelve las veces que ya apareció (o 0 si es la primera). Sin él, la primera vez daría §undefined + 1§, o sea §NaN§.

## Ordenar los resultados

Para ordenar un objeto lo pasas a un array de pares con §Object.entries()§:

§§§javascript
// por frecuencia descendente y, en empate, por orden alfabético
const orden = Object.entries(conteo).sort(
(a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
);
§§§

La comparación §b[1] - a[1]§ ordena por cantidad; si da §0§ (empate), el §||§ pasa a la segunda: el orden alfabético.

## Pasos de la lección

1. Total de palabras y palabras distintas.
2. Frecuencia de cada palabra, en orden alfabético.
3. La palabra más frecuente.
4. Las 3 palabras más frecuentes.
5. La palabra más larga.

**Ampliación:** lee un archivo de texto en vez de la entrada estándar, ignora palabras muy comunes ("el", "de", "y") o muestra un gráfico de barras con asteriscos.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'const conteo = { sol: 2 };\nconsole.log(conteo.sol ?? 0, conteo.luna ?? 0);',
            options: ['2 undefined', '2 0', '0 0', '2 NaN'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Suma una aparición a la palabra, sin que la primera vez dé `NaN`.',
          difficulty: 2,
          payload: {
            template: 'conteo[palabra] = (conteo[palabra] {{0}} 0) + {{1}};',
            blanks: ['??', '1'],
          },
        },
        {
          type: 'sort',
          prompt: 'Ordena las líneas que cuentan las palabras de un array.',
          difficulty: 2,
          payload: {
            blocks: [
              'const conteo = {};',
              'for (const palabra of palabras) {',
              '  conteo[palabra] = (conteo[palabra] ?? 0) + 1;',
              '}',
              'console.log(conteo);',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de texto. Pásala a minúsculas, quita los signos `. , ; : ! ? ¿ ¡` y divídela en palabras. Imprime `total: N, distintas: M`.',
          starterCode: TEXTO_NORMALIZADO,
          solution: `${TEXTO_NORMALIZADO}console.log('total: ' + palabras.length + ', distintas: ' + new Set(palabras).size);\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'hola mundo hola',
              expectedOutput: 'total: 3, distintas: 2',
              isHidden: false,
            },
            {
              input: 'Hola, mundo. HOLA!',
              expectedOutput: 'total: 3, distintas: 2',
              isHidden: false,
            },
            {
              input: '¿Quién? Yo.',
              expectedOutput: 'total: 2, distintas: 2',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime una línea `palabra: veces` por cada palabra distinta, en orden alfabético.',
          starterCode: `${TEXTO_NORMALIZADO}${CONTEO}`,
          solution: `${TEXTO_NORMALIZADO}${CONTEO}for (const palabra of Object.keys(conteo).sort()) {\n  console.log(palabra + ': ' + conteo[palabra]);\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'el gato y el perro',
              expectedOutput: 'el: 2\ngato: 1\nperro: 1\ny: 1',
              isHidden: false,
            },
            {
              input: 'Sol, sol, SOL!',
              expectedOutput: 'sol: 3',
              isHidden: false,
            },
            { input: 'b a', expectedOutput: 'a: 1\nb: 1', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime la palabra más frecuente con el formato `palabra (veces)`. Si hay empate, la que va primero en orden alfabético.',
          starterCode: `${TEXTO_NORMALIZADO}${CONTEO}`,
          solution: `${TEXTO_NORMALIZADO}${CONTEO}const orden = Object.entries(conteo).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));\nconsole.log(orden[0][0] + ' (' + orden[0][1] + ')');\n`,
          difficulty: 3,
          testCases: [
            { input: 'a b b a c', expectedOutput: 'a (2)', isHidden: false },
            {
              input: 'uno dos dos tres tres tres',
              expectedOutput: 'tres (3)',
              isHidden: false,
            },
            { input: 'solo', expectedOutput: 'solo (1)', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime las 3 palabras más frecuentes como `palabra: veces`, una por línea, ordenadas por frecuencia descendente y, en empate, alfabéticamente. Si hay menos de 3 palabras distintas, imprime las que haya.',
          starterCode: `${TEXTO_NORMALIZADO}${CONTEO}`,
          solution: `${TEXTO_NORMALIZADO}${CONTEO}const top = Object.entries(conteo)\n  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))\n  .slice(0, 3);\nfor (const [palabra, veces] of top) {\n  console.log(palabra + ': ' + veces);\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'a b b c c c d',
              expectedOutput: 'c: 3\nb: 2\na: 1',
              isHidden: false,
            },
            { input: 'x x y', expectedOutput: 'x: 2\ny: 1', isHidden: false },
            {
              input: 'b a b a c',
              expectedOutput: 'a: 2\nb: 2\nc: 1',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Con el mismo texto normalizado, imprime la palabra más larga como `palabra (longitud)`. Si hay empate, la que aparece primero.',
          starterCode: TEXTO_NORMALIZADO,
          solution: `${TEXTO_NORMALIZADO}const larga = palabras.reduce((mayor, p) => (p.length > mayor.length ? p : mayor));\nconsole.log(larga + ' (' + larga.length + ')');\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'el programador escribe codigo',
              expectedOutput: 'programador (11)',
              isHidden: false,
            },
            { input: 'sol mar', expectedOutput: 'sol (3)', isHidden: false },
            {
              input: 'Hola, ¿qué tal?',
              expectedOutput: 'hola (4)',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Al contar palabras, los resultados salen como `NaN`. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'const palabras = ["a", "b", "a"];',
              'const conteo = {};',
              'for (const palabra of palabras) {',
              '  conteo[palabra] += 1;',
              '}',
              'console.log(conteo);',
            ],
            buggyLineIndex: 3,
            explanation:
              'La primera vez que aparece una palabra no existe en el objeto: `undefined + 1` da `NaN` y sigue siendo `NaN` después. Hay que usar `conteo[palabra] = (conteo[palabra] ?? 0) + 1`.',
          },
        },
      ],
    },
  ],
};
