import type { SeedExercise } from '../curriculum.data';
import { LINEAS } from './common';

// Extra exercises appended (by lesson title) to the original JavaScript
// "Fundamentos" lessons; appending keeps existing exercise ids stable.
export const javascriptExtraExercises: Record<string, SeedExercise[]> = {
  'Variables y asignación': [
    {
      type: 'quiz',
      prompt: '¿Cuál es el valor de `x` al final?',
      difficulty: 1,
      payload: {
        code: 'let x = 4;\nx = x + 3;\nx += 2;',
        options: ['4', '7', '9', '12'],
        correctIndex: 2,
      },
    },
    {
      type: 'quiz',
      prompt: '¿Qué ocurre al ejecutar este código?',
      difficulty: 2,
      payload: {
        code: 'const a = 1;\na = 2;\nconsole.log(a);',
        options: [
          'Imprime 2',
          'Imprime 1',
          'Lanza TypeError: Assignment to constant variable',
          'Imprime undefined',
        ],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Declara una constante y muéstrala.',
      difficulty: 1,
      payload: {
        template: '{{0}} nombre = "Ana";\nconsole.log({{1}});',
        blanks: ['const', 'nombre'],
      },
    },
    {
      type: 'code',
      prompt: 'Lee dos números enteros (uno por línea) e imprime su suma.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const a = parseInt(lineas[0], 10);\nconst b = parseInt(lineas[1], 10);\nconsole.log(a + b);\n',
      difficulty: 1,
      testCases: [
        { input: '2\n3', expectedOutput: '5', isHidden: false },
        { input: '10\n-4', expectedOutput: '6', isHidden: false },
        { input: '0\n0', expectedOutput: '0', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt: 'Este programa debería intercambiar `a` y `b`. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'let a = 1;',
          'let b = 2;',
          'a = b;',
          'b = a;',
          'console.log(a, b);',
        ],
        buggyLineIndex: 2,
        explanation:
          'Al hacer `a = b` se pierde el valor original de `a`; después `b = a` copia el mismo valor. Hace falta una variable temporal (o `[a, b] = [b, a]`).',
      },
    },
  ],
  'Tipos de datos básicos': [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'console.log(typeof "42");',
        options: ['number', 'string', 'text', 'undefined'],
        correctIndex: 1,
      },
    },
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'console.log("5" + 2);',
        options: ['7', '52', 'NaN', 'Error'],
        correctIndex: 1,
      },
    },
    {
      type: 'fill',
      prompt: 'Convierte el texto a número para poder sumarle 1.',
      difficulty: 1,
      payload: {
        template:
          'const texto = "41";\nconst numero = {{0}}(texto);\nconsole.log(numero + {{1}});',
        blanks: ['Number', '1'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee el radio de un círculo (número decimal) e imprime su área (`3.14159 * radio * radio`) con exactamente 2 decimales, usando `toFixed(2)`.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const radio = parseFloat(lineas[0]);\nconsole.log((3.14159 * radio * radio).toFixed(2));\n',
      difficulty: 2,
      testCases: [
        { input: '1', expectedOutput: '3.14', isHidden: false },
        { input: '2', expectedOutput: '12.57', isHidden: false },
        { input: '0.5', expectedOutput: '0.79', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee un nombre y una edad (una por línea) e imprime: `Nombre tiene N años` usando una plantilla con backticks.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const nombre = lineas[0];\nconst edad = parseInt(lineas[1], 10);\nconsole.log(`${nombre} tiene ${edad} años`);\n',
      difficulty: 2,
      testCases: [
        {
          input: 'Luis\n30',
          expectedOutput: 'Luis tiene 30 años',
          isHidden: false,
        },
        {
          input: 'Eva\n8',
          expectedOutput: 'Eva tiene 8 años',
          isHidden: false,
        },
        {
          input: 'Sofía\n101',
          expectedOutput: 'Sofía tiene 101 años',
          isHidden: true,
        },
      ],
    },
  ],
  Condicionales: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'const nota = 65;\nif (nota >= 90) {\n  console.log("A");\n} else if (nota >= 60) {\n  console.log("B");\n} else {\n  console.log("C");\n}',
        options: ['A', 'B', 'C', 'No imprime nada'],
        correctIndex: 1,
      },
    },
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'console.log(0 || "hola");',
        options: ['0', 'hola', 'true', 'false'],
        correctIndex: 1,
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una nota (entero 0-100). Imprime "aprobado" si es 60 o más, de lo contrario "reprobado".',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const nota = parseInt(lineas[0], 10);\nif (nota >= 60) {\n  console.log("aprobado");\n} else {\n  console.log("reprobado");\n}\n',
      difficulty: 1,
      testCases: [
        { input: '75', expectedOutput: 'aprobado', isHidden: false },
        { input: '59', expectedOutput: 'reprobado', isHidden: false },
        { input: '60', expectedOutput: 'aprobado', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee tres números enteros (uno por línea) e imprime el mayor, sin usar `Math.max`.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const [a, b, c] = lineas.map(Number);\nlet mayor = a;\nif (b > mayor) {\n  mayor = b;\n}\nif (c > mayor) {\n  mayor = c;\n}\nconsole.log(mayor);\n',
      difficulty: 3,
      testCases: [
        { input: '1\n5\n3', expectedOutput: '5', isHidden: false },
        { input: '9\n2\n4', expectedOutput: '9', isHidden: false },
        { input: '-3\n-8\n-1', expectedOutput: '-1', isHidden: true },
        { input: '7\n7\n7', expectedOutput: '7', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt:
        'Este código debería imprimir "mayor" solo si la edad es exactamente 18, pero lo hace siempre. ¿Qué línea tiene el error?',
      difficulty: 2,
      payload: {
        lines: [
          'let edad = 10;',
          'if (edad = 18) {',
          '  console.log("mayor");',
          '}',
        ],
        buggyLineIndex: 1,
        explanation:
          'Un solo `=` asigna 18 a `edad` (y el resultado, 18, es "truthy"). Para comparar hay que usar `===`.',
      },
    },
  ],
  Bucles: [
    {
      type: 'code',
      prompt:
        'Lee un entero `n` e imprime los números del 1 al `n`, uno por línea.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const n = parseInt(lineas[0], 10);\nfor (let i = 1; i <= n; i++) {\n  console.log(i);\n}\n',
      difficulty: 1,
      testCases: [
        { input: '3', expectedOutput: '1\n2\n3', isHidden: false },
        { input: '1', expectedOutput: '1', isHidden: false },
        { input: '5', expectedOutput: '1\n2\n3\n4\n5', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee un entero `n` e imprime la suma de los números del 1 al `n`.',
      starterCode: LINEAS,
      solution:
        LINEAS +
        'const n = parseInt(lineas[0], 10);\nlet total = 0;\nfor (let i = 1; i <= n; i++) {\n  total += i;\n}\nconsole.log(total);\n',
      difficulty: 2,
      testCases: [
        { input: '4', expectedOutput: '10', isHidden: false },
        { input: '10', expectedOutput: '55', isHidden: false },
        { input: '1', expectedOutput: '1', isHidden: true },
      ],
    },
    {
      type: 'quiz',
      prompt: '¿Cuántas veces se imprime "hola"?',
      difficulty: 1,
      payload: {
        code: 'for (let i = 2; i < 6; i++) {\n  console.log("hola");\n}',
        options: ['2', '3', '4', '5'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Recorre del 0 al 4 y salta los números impares.',
      difficulty: 2,
      payload: {
        template:
          'for (let n = 0; n < {{0}}; n++) {\n  if (n % 2 === 1) {\n    {{1}};\n  }\n  console.log(n);\n}',
        blanks: ['5', 'continue'],
      },
    },
    {
      type: 'bug',
      prompt:
        'Este bucle debería terminar, pero se queda corriendo para siempre. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'let contador = 0;',
          'while (contador < 5) {',
          '  console.log(contador);',
          '}',
        ],
        buggyLineIndex: 2,
        explanation:
          'Falta incrementar `contador` dentro del bucle (`contador++`); sin eso la condición siempre es verdadera y el bucle es infinito.',
      },
    },
  ],
  Funciones: [
    {
      type: 'code',
      prompt:
        'Define `cuadrado(n)` que devuelva `n * n`. Lee un entero, llama a la función e imprime el resultado.',
      starterCode:
        "function cuadrado(n) {\n  // Escribe tu código aquí\n}\n\nconst n = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);\nconsole.log(cuadrado(n));\n",
      solution:
        "function cuadrado(n) {\n  return n * n;\n}\n\nconst n = parseInt(require('fs').readFileSync(0, 'utf8').trim(), 10);\nconsole.log(cuadrado(n));\n",
      difficulty: 1,
      testCases: [
        { input: '4', expectedOutput: '16', isHidden: false },
        { input: '-3', expectedOutput: '9', isHidden: false },
        { input: '0', expectedOutput: '0', isHidden: true },
      ],
    },
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'function saludar(nombre, idioma = "es") {\n  if (idioma === "es") {\n    return "Hola " + nombre;\n  }\n  return "Hello " + nombre;\n}\n\nconsole.log(saludar("Ana", "en"));',
        options: ['Hola Ana', 'Hello Ana', 'Ana', 'undefined'],
        correctIndex: 1,
      },
    },
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'const doble = (n) => n * 2;\nconsole.log(doble(4));',
        options: ['4', '8', 'n * 2', 'undefined'],
        correctIndex: 1,
      },
    },
    {
      type: 'sort',
      prompt:
        'Ordena las líneas para definir y usar una función que suma dos números.',
      difficulty: 1,
      payload: {
        blocks: [
          'function sumar(a, b) {',
          '  return a + b;',
          '}',
          'const resultado = sumar(2, 3);',
          'console.log(resultado);',
        ],
      },
    },
    {
      type: 'code',
      prompt:
        'Define `promedio(a, b, c)` que devuelva el promedio de tres números. Lee tres enteros (uno por línea) e imprime el promedio con 2 decimales usando `toFixed(2)`.',
      starterCode:
        "function promedio(a, b, c) {\n  // Escribe tu código aquí\n}\n\nconst [a, b, c] = require('fs').readFileSync(0, 'utf8').trim().split('\\n').map(Number);\nconsole.log(promedio(a, b, c).toFixed(2));\n",
      solution:
        "function promedio(a, b, c) {\n  return (a + b + c) / 3;\n}\n\nconst [a, b, c] = require('fs').readFileSync(0, 'utf8').trim().split('\\n').map(Number);\nconsole.log(promedio(a, b, c).toFixed(2));\n",
      difficulty: 2,
      testCases: [
        { input: '3\n4\n5', expectedOutput: '4.00', isHidden: false },
        { input: '1\n2\n2', expectedOutput: '1.67', isHidden: false },
        { input: '10\n10\n10', expectedOutput: '10.00', isHidden: true },
      ],
    },
  ],
  Arrays: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 2,
      payload: {
        code: 'const frutas = ["manzana", "pera", "uva"];\nconsole.log(frutas[-1]);',
        options: ['uva', 'manzana', 'undefined', 'Error'],
        correctIndex: 2,
      },
    },
    {
      type: 'fill',
      prompt: 'Agrega un elemento al final del array y muestra cuántos hay.',
      difficulty: 1,
      payload: {
        template:
          'const numeros = [1, 2, 3];\nnumeros.{{0}}(4);\nconsole.log(numeros.{{1}});',
        blanks: ['push', 'length'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una línea con números enteros separados por espacios e imprime su suma.',
      starterCode:
        "const numeros = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);\n",
      solution:
        "const numeros = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);\nconsole.log(numeros.reduce((suma, n) => suma + n, 0));\n",
      difficulty: 2,
      testCases: [
        { input: '1 2 3 4', expectedOutput: '10', isHidden: false },
        { input: '10', expectedOutput: '10', isHidden: false },
        { input: '-5 5 7', expectedOutput: '7', isHidden: true },
      ],
    },
    {
      type: 'code',
      prompt:
        'Lee una línea de enteros separados por espacios e imprime solo los pares, separados por espacios. Si no hay ninguno, imprime `ninguno`.',
      starterCode:
        "const numeros = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);\n",
      solution:
        "const numeros = require('fs').readFileSync(0, 'utf8').trim().split(' ').map(Number);\nconst pares = numeros.filter((n) => n % 2 === 0);\nconsole.log(pares.length > 0 ? pares.join(' ') : 'ninguno');\n",
      difficulty: 3,
      testCases: [
        { input: '1 2 3 4 5 6', expectedOutput: '2 4 6', isHidden: false },
        { input: '7 9', expectedOutput: 'ninguno', isHidden: false },
        { input: '8', expectedOutput: '8', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt:
        'El array tiene 3 elementos, pero el código falla al ejecutarse. ¿Qué línea tiene el error?',
      difficulty: 2,
      payload: {
        lines: [
          'const colores = ["rojo", "verde", "azul"];',
          'console.log(colores[0].toUpperCase());',
          'console.log(colores[3].toUpperCase());',
        ],
        buggyLineIndex: 2,
        explanation:
          'Los índices válidos van de 0 a 2. `colores[3]` es `undefined` y llamar `.toUpperCase()` sobre `undefined` lanza TypeError; el último elemento es `colores[colores.length - 1]`.',
      },
    },
  ],
  Objetos: [
    {
      type: 'quiz',
      prompt: '¿Qué imprime este código?',
      difficulty: 1,
      payload: {
        code: 'const precios = { pan: 800, leche: 2500 };\nconsole.log(precios.leche);',
        options: ['800', '2500', 'leche', 'undefined'],
        correctIndex: 1,
      },
    },
    {
      type: 'fill',
      prompt:
        'Muestra un valor por defecto si la propiedad no existe (operador de coalescencia nula).',
      difficulty: 2,
      payload: {
        template:
          'const contacto = { nombre: "Ana" };\nconsole.log(contacto.telefono {{0}} "N/A");',
        blanks: ['??'],
      },
    },
    {
      type: 'code',
      prompt:
        'Lee una palabra y cuenta cuántas veces aparece cada letra. Imprime una línea `letra: cantidad` por cada letra, en el orden en que aparece por primera vez.',
      starterCode:
        "const palabra = require('fs').readFileSync(0, 'utf8').trim();\nconst conteo = {};\n",
      solution:
        "const palabra = require('fs').readFileSync(0, 'utf8').trim();\nconst conteo = {};\nfor (const letra of palabra) {\n  conteo[letra] = (conteo[letra] ?? 0) + 1;\n}\nfor (const [letra, cantidad] of Object.entries(conteo)) {\n  console.log(`${letra}: ${cantidad}`);\n}\n",
      difficulty: 3,
      testCases: [
        {
          input: 'hola',
          expectedOutput: 'h: 1\no: 1\nl: 1\na: 1',
          isHidden: false,
        },
        { input: 'casa', expectedOutput: 'c: 1\na: 2\ns: 1', isHidden: false },
        { input: 'aaa', expectedOutput: 'a: 3', isHidden: true },
      ],
    },
    {
      type: 'bug',
      prompt:
        'Este código debería imprimir la edad con un decimal, pero lanza un error. ¿Qué línea falla?',
      difficulty: 2,
      payload: {
        lines: [
          'const persona = { nombre: "Luis", edad: 30 };',
          'console.log(persona.nombre);',
          'console.log(persona.edad.toFixed(1));',
          'console.log(persona.Edad.toFixed(1));',
        ],
        buggyLineIndex: 3,
        explanation:
          'Los nombres de propiedad distinguen mayúsculas: `persona.Edad` no existe (es `undefined`), y `undefined.toFixed(1)` lanza TypeError. La propiedad es `edad`.',
      },
    },
  ],
};
