import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

export const moduloFunciones: SeedModule = {
  title: 'Funciones a fondo',
  lessons: [
    {
      title: 'Parámetros y argumentos',
      xpReward: 10,
      contentMarkdown: md`
# Parámetros y argumentos

Un **parámetro** es el nombre que aparece en la definición de la función; un **argumento** es el valor real que le pasas al llamarla.

§§§javascript
function rectangulo(base, altura) { // base, altura: parámetros
return base * altura;
}

rectangulo(3, 4); // 3 y 4: argumentos
§§§

## Argumentos que faltan o sobran

JavaScript **no se queja** si pasas de menos o de más:

§§§javascript
function resta(a, b) {
return a - b;
}

resta(10); // NaN (b es undefined: 10 - undefined)
resta(10, 3, 99); // 7 (el 99 se ignora)
§§§

Ese silencio es una fuente clásica de errores: si ves §NaN§ o §undefined§ donde no lo esperas, revisa los argumentos.

## Valores por defecto

§§§javascript
function potencia(base, exponente = 2) {
return base ** exponente;
}

potencia(5); // 25 (usa exponente = 2)
potencia(5, 3); // 125
§§§

## Cantidad variable de argumentos: §...§

§§§javascript
function sumar(...numeros) {
return numeros.reduce((suma, n) => suma + n, 0);
}

sumar(1, 2); // 3
sumar(1, 2, 3, 4); // 10
§§§

Dentro de la función §numeros§ es un **array**. Al llamar, §...§ también reparte un array en argumentos: §sumar(...[1, 2, 3])§.

## "Argumentos nombrados" con un objeto

JavaScript no tiene argumentos nombrados, pero se simulan desestructurando un objeto:

§§§javascript
function saludar({ nombre, saludo = "Hola" }) {
return saludo + ", " + nombre + "!";
}

saludar({ nombre: "Ana" }); // "Hola, Ana!"
saludar({ saludo: "Buenas", nombre: "Luis" }); // el orden no importa
§§§

## Una función, una tarea

Si una función hace demasiadas cosas, divídela. Nombres claros (§calcularPromedio§, no §f1§) hacen el código casi autoexplicativo.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'function multiplicar(a, b = 2) {\n  return a * b;\n}\n\nconsole.log(multiplicar(3));',
            options: ['3', '5', '6', 'NaN'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'function resta(a, b) {\n  return a - b;\n}\n\nconsole.log(resta(10));',
            options: ['10', '0', 'NaN', 'Error'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Haz que la función acepte cualquier cantidad de números.',
          difficulty: 2,
          payload: {
            template:
              'function sumar(...{{0}}) {\n  return {{1}}.reduce((suma, n) => suma + n, 0);\n}',
            blanks: ['numeros', 'numeros'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `potencia(base, exponente = 2)`. Lee un entero `base` e imprime `potencia(base)` y, en la línea siguiente, `potencia(base, 3)`.',
          starterCode: `function potencia(base, exponente = 2) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const base = parseInt(lineas[0], 10);\nconsole.log(potencia(base));\nconsole.log(potencia(base, 3));\n`,
          solution: `function potencia(base, exponente = 2) {\n  return base ** exponente;\n}\n\n${LINEAS}const base = parseInt(lineas[0], 10);\nconsole.log(potencia(base));\nconsole.log(potencia(base, 3));\n`,
          difficulty: 2,
          testCases: [
            { input: '3', expectedOutput: '9\n27', isHidden: false },
            { input: '2', expectedOutput: '4\n8', isHidden: false },
            { input: '-2', expectedOutput: '4\n-8', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `promedio(...numeros)` que devuelva el promedio de los valores recibidos. Lee una línea de enteros, pásalos a la función con `...` e imprime el promedio con 2 decimales (`toFixed(2)`).',
          starterCode: `function promedio(...numeros) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const valores = lineas[0].split(' ').map(Number);\nconsole.log(promedio(...valores).toFixed(2));\n`,
          solution: `function promedio(...numeros) {\n  return numeros.reduce((suma, n) => suma + n, 0) / numeros.length;\n}\n\n${LINEAS}const valores = lineas[0].split(' ').map(Number);\nconsole.log(promedio(...valores).toFixed(2));\n`,
          difficulty: 3,
          testCases: [
            { input: '4 6', expectedOutput: '5.00', isHidden: false },
            { input: '1 2 2', expectedOutput: '1.67', isHidden: false },
            { input: '10', expectedOutput: '10.00', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `saludar({ nombre, saludo = "Hola" })` que devuelva `saludo, nombre!`. Lee un nombre y un saludo (una por línea) e imprime el resultado pasando un objeto a la función.',
          starterCode: `function saludar({ nombre, saludo = 'Hola' }) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const [nombre, saludo] = lineas;\nconsole.log(saludar({ nombre, saludo }));\n`,
          solution: `function saludar({ nombre, saludo = 'Hola' }) {\n  return saludo + ', ' + nombre + '!';\n}\n\n${LINEAS}const [nombre, saludo] = lineas;\nconsole.log(saludar({ nombre, saludo }));\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'Ana\nBuenas',
              expectedOutput: 'Buenas, Ana!',
              isHidden: false,
            },
            {
              input: 'Luis\nHola',
              expectedOutput: 'Hola, Luis!',
              isHidden: false,
            },
            {
              input: 'Eva\nHello',
              expectedOutput: 'Hello, Eva!',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa imprime `NaN` en lugar del precio con descuento. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'function descuento(precio, porcentaje) {',
              '  return precio - precio * porcentaje / 100;',
              '}',
              '',
              'console.log(descuento(200));',
            ],
            buggyLineIndex: 4,
            explanation:
              'Falta el segundo argumento: `porcentaje` vale `undefined` y la cuenta da `NaN`. Hay que llamar `descuento(200, 10)` (o darle un valor por defecto al parámetro).',
          },
        },
      ],
    },
    {
      title: 'Alcance, let/const y closures',
      xpReward: 15,
      contentMarkdown: md`
# Alcance, let/const y closures

## Alcance (scope)

El **alcance** de una variable es la parte del programa donde existe.

§§§javascript
let x = 10; // variable global

function cambiar() {
let x = 5; // otra variable, LOCAL a la función
console.log(x); // 5
}

cambiar();
console.log(x); // 10 — la global no cambió
§§§

## §let§ / §const§ frente a §var§

- §let§ y §const§ tienen alcance de **bloque** (lo que está entre §{ }§).
- §var§ tiene alcance de **función** y se "escapa" de los bloques: evítalo.

§§§javascript
if (true) {
var a = 1;
let b = 2;
}
console.log(a); // 1
console.log(b); // ReferenceError: b is not defined
§§§

**Regla:** usa §const§ por defecto y §let§ solo si el valor va a cambiar. §const§ impide reasignar la variable, pero **no** congela objetos ni arrays: §const lista = []; lista.push(1);§ es válido.

## §return§ no es §console.log()§

- §console.log()§ **muestra** algo en pantalla.
- §return§ **entrega** un valor a quien llamó la función.

Una función sin §return§ devuelve §undefined§:

§§§javascript
function suma(a, b) {
console.log(a + b);
}

const resultado = suma(2, 3); // imprime 5
console.log(resultado + 1); // NaN (undefined + 1)
§§§

## Closures: funciones que recuerdan

Una función definida dentro de otra **recuerda** las variables de su alrededor, incluso cuando la externa ya terminó:

§§§javascript
function crearContador() {
let cuenta = 0;
return () => {
cuenta += 1;
return cuenta;
};
}

const contar = crearContador();
contar(); // 1
contar(); // 2
§§§

Cada llamada a §crearContador()§ crea su propio §cuenta§ privado. Los closures son la base de muchas técnicas de JavaScript (callbacks, módulos, memoización).
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'let x = 10;\n\nfunction f() {\n  let x = 5;\n}\n\nf();\nconsole.log(x);',
            options: ['5', '10', 'undefined', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'if (true) {\n  var a = 1;\n}\nconsole.log(a);',
            options: ['1', 'undefined', 'ReferenceError', 'null'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 3,
          payload: {
            code: 'function crear() {\n  let c = 0;\n  return () => ++c;\n}\n\nconst f = crear();\nf();\nconsole.log(f());',
            options: ['0', '1', '2', 'undefined'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt:
            'Completa el closure para que la función devuelta recuerde `cuenta`.',
          difficulty: 3,
          payload: {
            template:
              'function crearContador() {\n  let cuenta = 0;\n  return {{0}} => {\n    cuenta += 1;\n    return cuenta;\n  };\n}\nconst contar = crearContador();\ncontar();\nconsole.log({{1}}());',
            blanks: ['()', 'contar'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `crearContador()` que devuelva una función; cada vez que se llame, esa función devuelve 1, 2, 3... Lee un entero `n`, llámala `n` veces e imprime cada resultado en su propia línea.',
          starterCode: `function crearContador() {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const n = parseInt(lineas[0], 10);\nconst contar = crearContador();\nfor (let i = 0; i < n; i++) {\n  console.log(contar());\n}\n`,
          solution: `function crearContador() {\n  let cuenta = 0;\n  return () => {\n    cuenta += 1;\n    return cuenta;\n  };\n}\n\n${LINEAS}const n = parseInt(lineas[0], 10);\nconst contar = crearContador();\nfor (let i = 0; i < n; i++) {\n  console.log(contar());\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '3', expectedOutput: '1\n2\n3', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '5', expectedOutput: '1\n2\n3\n4\n5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `esPrimo(n)` que devuelva `true` si `n` es primo (mayor que 1 y solo divisible entre 1 y él mismo). Lee un entero e imprime `primo` o `no primo`.',
          starterCode: `function esPrimo(n) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}console.log(esPrimo(parseInt(lineas[0], 10)) ? 'primo' : 'no primo');\n`,
          solution: `function esPrimo(n) {\n  if (n < 2) {\n    return false;\n  }\n  for (let i = 2; i * i <= n; i++) {\n    if (n % i === 0) {\n      return false;\n    }\n  }\n  return true;\n}\n\n${LINEAS}console.log(esPrimo(parseInt(lineas[0], 10)) ? 'primo' : 'no primo');\n`,
          difficulty: 3,
          testCases: [
            { input: '17', expectedOutput: 'primo', isHidden: false },
            { input: '9', expectedOutput: 'no primo', isHidden: false },
            { input: '2', expectedOutput: 'primo', isHidden: true },
            { input: '1', expectedOutput: 'no primo', isHidden: true },
            { input: '0', expectedOutput: 'no primo', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `precioFinal(precio, descuento = 10)` que devuelva el precio tras aplicar el porcentaje de descuento. Lee un precio y un descuento (enteros, uno por línea) e imprime el resultado con 2 decimales (`toFixed(2)`).',
          starterCode: `function precioFinal(precio, descuento = 10) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}const [precio, descuento] = lineas.map(Number);\nconsole.log(precioFinal(precio, descuento).toFixed(2));\n`,
          solution: `function precioFinal(precio, descuento = 10) {\n  return precio - precio * descuento / 100;\n}\n\n${LINEAS}const [precio, descuento] = lineas.map(Number);\nconsole.log(precioFinal(precio, descuento).toFixed(2));\n`,
          difficulty: 2,
          testCases: [
            { input: '200\n10', expectedOutput: '180.00', isHidden: false },
            { input: '99\n15', expectedOutput: '84.15', isHidden: false },
            { input: '50\n0', expectedOutput: '50.00', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa imprime `NaN` en lugar de 6. ¿Qué línea es la causa?',
          difficulty: 2,
          payload: {
            lines: [
              'function suma(a, b) {',
              '  console.log(a + b);',
              '}',
              '',
              'const total = suma(2, 3) + 1;',
              'console.log(total);',
            ],
            buggyLineIndex: 1,
            explanation:
              'La función muestra el resultado pero no lo devuelve, así que `suma(2, 3)` vale `undefined` y `undefined + 1` es `NaN`. Debe usar `return a + b;`.',
          },
        },
      ],
    },
    {
      title: 'Recursión',
      xpReward: 15,
      contentMarkdown: md`
# Recursión

Una función es **recursiva** cuando se llama a sí misma para resolver una versión más pequeña del mismo problema.

Toda recursión necesita dos partes:

1. **Caso base:** la situación más simple, que se responde directamente y detiene la recursión.
2. **Caso recursivo:** la función se llama con un problema **más pequeño**, acercándose al caso base.

## Ejemplo: factorial

§5! = 5 × 4 × 3 × 2 × 1§. Pero también §5! = 5 × 4!§, y así sucesivamente.

§§§javascript
function factorial(n) {
if (n <= 1) { // caso base
return 1;
}
return n * factorial(n - 1); // caso recursivo
}

factorial(4); // 24
§§§

Así se ejecuta §factorial(4)§:

§§§text
factorial(4) = 4 * factorial(3)
= 4 * (3 * factorial(2))
= 4 * (3 * (2 * factorial(1)))
= 4 * (3 * (2 * 1)) = 24
§§§

## Ejemplo: cuenta regresiva

§§§javascript
function cuenta(n) {
if (n === 0) {
console.log("¡Listo!");
return;
}
console.log(n);
cuenta(n - 1);
}
§§§

## El error clásico

Sin caso base (o si nunca se alcanza), la función se llama infinitamente hasta que JavaScript lanza **§RangeError: Maximum call stack size exceeded§**.

## ¿Recursión o bucle?

Todo lo recursivo se puede hacer con bucles, normalmente más rápido y con menos memoria. La recursión brilla cuando el problema es **naturalmente recursivo** (árboles, carpetas dentro de carpetas, divide y vencerás). Para aprender, practicarla es muy valioso.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'function factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(4));',
            options: ['10', '24', '12', '4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué parte es imprescindible para que una función recursiva termine?',
          difficulty: 1,
          payload: {
            code: 'function f(n) {\n  return f(n - 1);\n}',
            options: [
              'Un bucle for',
              'Un caso base que detenga las llamadas',
              'Una variable global',
              'Usar console.log en vez de return',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas para definir el factorial de forma recursiva.',
          difficulty: 2,
          payload: {
            blocks: [
              'function factorial(n) {',
              '  if (n <= 1) {',
              '    return 1;',
              '  }',
              '  return n * factorial(n - 1);',
              '}',
            ],
          },
        },
        {
          type: 'fill',
          prompt:
            'Completa la cuenta regresiva: caso base y llamada más pequeña.',
          difficulty: 2,
          payload: {
            template:
              'function cuenta(n) {\n  if (n === {{0}}) {\n    return;\n  }\n  console.log(n);\n  cuenta(n {{1}} 1);\n}',
            blanks: ['0', '-'],
          },
        },
        {
          type: 'code',
          prompt:
            'Define `factorial(n)` de forma recursiva. Lee un entero `n >= 0` e imprime su factorial (el factorial de 0 es 1).',
          starterCode: `function factorial(n) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}console.log(factorial(parseInt(lineas[0], 10)));\n`,
          solution: `function factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n\n${LINEAS}console.log(factorial(parseInt(lineas[0], 10)));\n`,
          difficulty: 2,
          testCases: [
            { input: '5', expectedOutput: '120', isHidden: false },
            { input: '0', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '3628800', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `fibonacci(n)` recursivamente (`fibonacci(0) = 0`, `fibonacci(1) = 1`, y cada término es la suma de los dos anteriores). Lee `n` (0 a 20) e imprime `fibonacci(n)`.',
          starterCode: `function fibonacci(n) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}console.log(fibonacci(parseInt(lineas[0], 10)));\n`,
          solution: `function fibonacci(n) {\n  if (n < 2) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n${LINEAS}console.log(fibonacci(parseInt(lineas[0], 10)));\n`,
          difficulty: 3,
          testCases: [
            { input: '6', expectedOutput: '8', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: true },
            { input: '15', expectedOutput: '610', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `sumaDigitos(n)` de forma recursiva (la suma de los dígitos de `n` es el último dígito más la suma de los dígitos del resto). Lee un entero positivo e imprime el resultado.',
          starterCode: `function sumaDigitos(n) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}console.log(sumaDigitos(parseInt(lineas[0], 10)));\n`,
          solution: `function sumaDigitos(n) {\n  if (n < 10) {\n    return n;\n  }\n  return (n % 10) + sumaDigitos(Math.floor(n / 10));\n}\n\n${LINEAS}console.log(sumaDigitos(parseInt(lineas[0], 10)));\n`,
          difficulty: 3,
          testCases: [
            { input: '123', expectedOutput: '6', isHidden: false },
            { input: '9', expectedOutput: '9', isHidden: false },
            { input: '9999', expectedOutput: '36', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Al ejecutarse, el programa termina con `RangeError: Maximum call stack size exceeded`. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'function factorial(n) {',
              '  return n * factorial(n - 1);',
              '}',
              '',
              'console.log(factorial(3));',
            ],
            buggyLineIndex: 1,
            explanation:
              'Falta el caso base: la función nunca deja de llamarse a sí misma. Hay que añadir antes `if (n <= 1) { return 1; }`.',
          },
        },
      ],
    },
    {
      title: 'Funciones flecha y callbacks',
      xpReward: 10,
      contentMarkdown: md`
# Funciones flecha y callbacks

## Funciones flecha

Una forma más corta de escribir funciones:

§§§javascript
const sumar = (a, b) => a + b; // return implícito (una expresión)
const doble = (n) => n * 2;
const saludar = (nombre) => { // con llaves hay que escribir return
return "Hola " + nombre;
};
§§§

**Error típico:** poner llaves y olvidar §return§. §(n) => { n * n }§ devuelve §undefined§, no el cuadrado.

## Funciones como valores

En JavaScript una función es un valor más: se puede guardar en una variable, pasar como argumento y devolver desde otra función.

Una función que **recibe otra función** se llama de **orden superior**, y la que se le pasa es un **callback**:

§§§javascript
function aplicar(lista, accion) {
const resultado = [];
for (const elemento of lista) {
resultado.push(accion(elemento));
}
return resultado;
}

aplicar([1, 2, 3], (n) => n * 10); // [10, 20, 30]
§§§

Eso es exactamente lo que hacen §map§, §filter§, §forEach§ y §sort§.

## Callbacks en la práctica

§§§javascript
[1, 2, 3, 4].filter((n) => n % 2 === 0); // [2, 4]
["pera", "uva", "kiwi"].sort((a, b) => a.length - b.length);
// ["uva", "pera", "kiwi"] (por longitud; si empatan, mantiene el orden)
[3, 8, 12].find((n) => n > 5); // 8
setTimeout(() => console.log("pasó 1 segundo"), 1000); // se ejecuta más tarde
§§§

## Encontrar el mayor con §reduce§

§§§javascript
const palabras = ["casa", "sol", "arbol"];
palabras.reduce((mayor, p) => (p.length > mayor.length ? p : mayor)); // "arbol"
§§§

Con §reduce§ el primer valor acumulado es el primer elemento, y en cada vuelta se decide quién se queda.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'const sumar = (a, b) => a + b;\nconsole.log(sumar(2, 3));',
            options: ['23', '5', 'undefined', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log([1, 2, 3].map((x) => x * 2));',
            options: [
              '[ 1, 2, 3 ]',
              '[ 2, 4, 6 ]',
              '[ 2, 4, 6, 8 ]',
              'undefined',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Filtra los pares y ordena las palabras por longitud.',
          difficulty: 3,
          payload: {
            template:
              'const pares = [1, 2, 3, 4].filter((n) => n % 2 === {{0}});\nconst orden = ["pera", "uva"].sort((a, b) => a.length {{1}} b.length);',
            blanks: ['0', '-'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime cada uno multiplicado por 2, separados por un espacio. Usa `map` con una función flecha.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconsole.log(numeros.map((n) => n * 2).join(' '));\n`,
          difficulty: 2,
          testCases: [
            { input: '1 2 3', expectedOutput: '2 4 6', isHidden: false },
            { input: '5', expectedOutput: '10', isHidden: false },
            { input: '-1 0 4', expectedOutput: '-2 0 8', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de enteros e imprime solo los mayores que 10, separados por un espacio, usando `filter`. Si no hay ninguno, imprime `ninguno`.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nconst mayores = numeros.filter((n) => n > 10);\nconsole.log(mayores.length > 0 ? mayores.join(' ') : 'ninguno');\n`,
          difficulty: 2,
          testCases: [
            { input: '5 12 8 30', expectedOutput: '12 30', isHidden: false },
            { input: '1 2 3', expectedOutput: 'ninguno', isHidden: false },
            { input: '11', expectedOutput: '11', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de palabras e imprímelas ordenadas de la más corta a la más larga (si empatan, se mantiene el orden original), separadas por un espacio.',
          starterCode: `${LINEAS}const palabras = lineas[0].split(' ');\n`,
          solution: `${LINEAS}const palabras = lineas[0].split(' ');\nconsole.log(palabras.sort((a, b) => a.length - b.length).join(' '));\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'pera uva kiwi',
              expectedOutput: 'uva pera kiwi',
              isHidden: false,
            },
            { input: 'sol luna', expectedOutput: 'sol luna', isHidden: false },
            {
              input: 'abeja gato pez',
              expectedOutput: 'pez gato abeja',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de palabras e imprime la más larga (si hay empate, la primera). Usa `reduce`.',
          starterCode: `${LINEAS}const palabras = lineas[0].split(' ');\n`,
          solution: `${LINEAS}const palabras = lineas[0].split(' ');\nconsole.log(palabras.reduce((mayor, p) => (p.length > mayor.length ? p : mayor)));\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'casa sol arbol',
              expectedOutput: 'arbol',
              isHidden: false,
            },
            { input: 'ab cd', expectedOutput: 'ab', isHidden: false },
            {
              input: 'python java c',
              expectedOutput: 'python',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'La función debería devolver el cuadrado, pero el programa imprime `NaN`. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'const cuadrado = (n) => {',
              '  n * n;',
              '};',
              'console.log(cuadrado(3) + 1);',
            ],
            buggyLineIndex: 1,
            explanation:
              'Con llaves, la función flecha no devuelve nada a menos que uses `return`: `cuadrado(3)` es `undefined` y `undefined + 1` es `NaN`. Debe ser `return n * n;` (o quitar las llaves: `(n) => n * n`).',
          },
        },
      ],
    },
  ],
};
