import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

export const moduloEntradaSalida: SeedModule = {
  title: 'Entrada, salida y lógica',
  lessons: [
    {
      title: 'Entrada y salida',
      xpReward: 10,
      contentMarkdown: md`
# Entrada y salida

Un programa útil se comunica: **muestra** información (salida) y **recibe** datos (entrada).

## Salida con §console.log()§

§§§javascript
console.log("Hola, mundo");
console.log("Tengo", 3, "gatos"); // varios valores, separados por un espacio
§§§

Para unir con otro separador, usa §join()§ sobre un array; para no saltar de línea, §process.stdout.write()§:

§§§javascript
console.log(["a", "b", "c"].join("-")); // a-b-c
process.stdout.write("Cargando..."); // sin salto de línea
§§§

## Entrada

En un navegador se usa §prompt()§. En los ejercicios de CodeQuest (que se ejecutan con Node.js) la entrada llega por la entrada estándar, **una línea por cada valor**:

§§§javascript
const lineas = require('fs').readFileSync(0, 'utf8').trim().split('\n');
const nombre = lineas[0];
console.log("Hola,", nombre);
§§§

Lo leído **siempre es texto** (§string§). Si necesitas un número, conviértelo:

§§§javascript
const edad = parseInt(lineas[1], 10); // entero
const altura = parseFloat(lineas[2]); // decimal
console.log("El año que viene tendrás", edad + 1);
§§§

**Error típico:** olvidar la conversión. Con §"5" + 1§ JavaScript **no falla**: concatena y da §"51"§. Es un error silencioso, por eso hay que convertir siempre que quieras calcular.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log("a", "b", "c");',
            options: ['abc', 'a b c', 'a,b,c', 'a-b-c'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(["a", "b", "c"].join("-"));',
            options: ['a b c', 'abc', 'a-b-c', "[ 'a', 'b', 'c' ]"],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Lee el nombre de la primera línea y salúdalo.',
          difficulty: 1,
          payload: {
            template:
              "const lineas = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst nombre = lineas[{{0}}];\nconsole.log('Hola,', {{1}});",
            blanks: ['0', 'nombre'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un nombre y un apellido (uno por línea) e imprime `apellido, nombre`.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(\`\${lineas[1]}, \${lineas[0]}\`);\n`,
          difficulty: 1,
          testCases: [
            {
              input: 'Ana\nPérez',
              expectedOutput: 'Pérez, Ana',
              isHidden: false,
            },
            {
              input: 'Luis\nGómez',
              expectedOutput: 'Gómez, Luis',
              isHidden: false,
            },
            { input: 'Eva\nRuiz', expectedOutput: 'Ruiz, Eva', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee la base y la altura de un rectángulo (enteros, una por línea) e imprime su área.',
          starterCode: LINEAS,
          solution: `${LINEAS}const base = parseInt(lineas[0], 10);\nconst altura = parseInt(lineas[1], 10);\nconsole.log(base * altura);\n`,
          difficulty: 1,
          testCases: [
            { input: '3\n4', expectedOutput: '12', isHidden: false },
            { input: '10\n10', expectedOutput: '100', isHidden: false },
            { input: '7\n1', expectedOutput: '7', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Debería imprimir la edad del año que viene (por ejemplo, 21), pero imprime `201`. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              "const lineas = require('fs').readFileSync(0, 'utf8').trim().split('\\n');",
              'const edad = lineas[0];',
              'console.log(edad + 1);',
            ],
            buggyLineIndex: 1,
            explanation:
              'Lo que se lee de la entrada es texto: `"20" + 1` concatena y da `"201"`. Hay que convertirlo: `const edad = parseInt(lineas[0], 10);`.',
          },
        },
      ],
    },
    {
      title: 'Operadores aritméticos',
      xpReward: 10,
      contentMarkdown: md`
# Operadores aritméticos

| Operador | Significado                    | Ejemplo  | Resultado |
| -------- | ------------------------------ | -------- | --------- |
| §+§      | suma                           | §7 + 2§  | §9§       |
| §-§      | resta                          | §7 - 2§  | §5§       |
| §*§      | multiplicación                 | §7 * 2§  | §14§      |
| §/§      | división (puede dar decimales) | §7 / 2§  | §3.5§     |
| §%§      | resto (módulo)                 | §7 % 2§  | §1§       |
| §**§     | potencia                       | §2 ** 3§ | §8§       |

JavaScript **no tiene un operador de división entera**. Se obtiene con §Math.floor()§ (hacia abajo) o §Math.trunc()§ (quita los decimales):

§§§javascript
Math.floor(7 / 2); // 3
Math.floor(-7 / 2); // -4 (hacia abajo)
Math.trunc(-7 / 2); // -3 (quita decimales)
§§§

## Precedencia

Primero §**§, luego §*§ §/§ §%§, y al final §+§ §-§. Los paréntesis mandan:

§§§javascript
console.log(2 + 3 * 4); // 14
console.log((2 + 3) * 4); // 20
§§§

## Para qué sirve el resto §%§

- Saber si un número es par: §n % 2 === 0§.
- Obtener el último dígito: §n % 10§.
- Convertir segundos en minutos y segundos: §Math.floor(s / 60)§ y §s % 60§.

## Operadores abreviados

§§§javascript
let total = 10;
total += 5; // 15
total *= 2; // 30
total++; // 31 (suma uno)
§§§

## Decimales

Los números decimales no son exactos: §0.1 + 0.2§ da §0.30000000000000004§. Para mostrarlos con pocos decimales usa §toFixed()§: §(0.1 + 0.2).toFixed(2)§ devuelve §"0.30"§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(17 % 5);',
            options: ['3', '2', '3.4', '12'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(7 / 2);',
            options: ['3', '3.5', '4', '2'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(2 + 3 * 4);',
            options: ['20', '14', '24', '9'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Usa el operador correcto para obtener el resto y la potencia.',
          difficulty: 1,
          payload: {
            template:
              'console.log(17 {{0}} 5);   // 2\nconsole.log(2 {{1}} 3);    // 8',
            blanks: ['%', '**'],
          },
        },
        {
          type: 'fill',
          prompt: 'Obtén la división entera de 17 entre 5.',
          difficulty: 2,
          payload: {
            template: 'console.log(Math.{{0}}(17 / 5));   // 3',
            blanks: ['floor'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una cantidad de segundos (entero) e imprime `M min S s`, donde M son los minutos completos y S los segundos restantes.',
          starterCode: LINEAS,
          solution: `${LINEAS}const segundos = parseInt(lineas[0], 10);\nconst minutos = Math.floor(segundos / 60);\nconst resto = segundos % 60;\nconsole.log(\`\${minutos} min \${resto} s\`);\n`,
          difficulty: 2,
          testCases: [
            { input: '125', expectedOutput: '2 min 5 s', isHidden: false },
            { input: '59', expectedOutput: '0 min 59 s', isHidden: false },
            { input: '3600', expectedOutput: '60 min 0 s', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt: 'Lee un entero positivo e imprime su último dígito.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(parseInt(lineas[0], 10) % 10);\n`,
          difficulty: 1,
          testCases: [
            { input: '457', expectedOutput: '7', isHidden: false },
            { input: '10', expectedOutput: '0', isHidden: false },
            { input: '9', expectedOutput: '9', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una temperatura en grados Celsius (entero) e imprime los grados Fahrenheit con 1 decimal (`toFixed(1)`). Fórmula: `c * 9 / 5 + 32`.',
          starterCode: LINEAS,
          solution: `${LINEAS}const c = parseInt(lineas[0], 10);\nconsole.log((c * 9 / 5 + 32).toFixed(1));\n`,
          difficulty: 2,
          testCases: [
            { input: '0', expectedOutput: '32.0', isHidden: false },
            { input: '100', expectedOutput: '212.0', isHidden: false },
            { input: '-40', expectedOutput: '-40.0', isHidden: true },
            { input: '37', expectedOutput: '98.6', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Debería calcular el promedio de `a` y `b`, pero el resultado es incorrecto. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'const a = 10;',
              'const b = 20;',
              'const promedio = a + b / 2;',
              'console.log(promedio);',
            ],
            buggyLineIndex: 2,
            explanation:
              'La división se ejecuta antes que la suma: queda `10 + 10` = 20. Hacen falta paréntesis: `(a + b) / 2`.',
          },
        },
      ],
    },
    {
      title: 'Comparaciones y lógica booleana',
      xpReward: 10,
      contentMarkdown: md`
# Comparaciones y lógica booleana

Una comparación produce un valor **booleano**: §true§ o §false§.

§§§javascript
5 > 3 // true
5 === 5 // true (igual)
5 !== 5 // false (distinto)
"a" < "b" // true (orden alfabético)
§§§

## §===§ y no §==§

§==§ convierte los tipos antes de comparar y da resultados sorprendentes:

§§§javascript
"5" == 5 // true (!)
"5" === 5 // false (distinto tipo)
0 == "" // true (!)
§§§

**Regla práctica:** usa siempre §===§ y §!==§.

## Combinar condiciones

| Operador   | Es verdadero cuando...        |
| ---------- | ----------------------------- |
| §A && B§   | **ambas** son verdaderas      |
| §A \|\| B§ | **al menos una** es verdadera |
| §!A§       | A es falsa                    |

| A     | B     | A && B | A \|\| B |
| ----- | ----- | ------ | -------- |
| true  | true  | true   | true     |
| true  | false | false  | true     |
| false | true  | false  | true     |
| false | false | false  | false    |

## Comparaciones encadenadas: ¡no existen!

En matemáticas se escribe §1 < x < 10§, pero en JavaScript eso **no funciona como esperas**:

§§§javascript
const x = 50;
console.log(1 < x < 10); // true (!) porque (1 < 50) es true, y true < 10 es true
console.log(x > 1 && x < 10) // false (forma correcta)
§§§

## Valores "truthy" y "falsy"

Se tratan como §false§: §0§, §""§, §null§, §undefined§, §NaN§. Todo lo demás cuenta como §true§.

§§§javascript
console.log(0 || "por defecto"); // "por defecto"
console.log(null ?? "por defecto"); // "por defecto" (?? solo mira null/undefined)
§§§

## Cortocircuito

En §A && B§, si A es falso JavaScript ni evalúa B. En §A || B§, si A es verdadero tampoco.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(!(true && false));',
            options: ['true', 'false', 'undefined', 'Error'],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log("5" == 5, "5" === 5);',
            options: ['true true', 'true false', 'false true', 'false false'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué imprime este código? (cuidado: no hay comparaciones encadenadas)',
          difficulty: 3,
          payload: {
            code: 'console.log(1 < 5 < 3);',
            options: ['true', 'false', 'undefined', 'Error'],
            correctIndex: 0,
          },
        },
        {
          type: 'fill',
          prompt: 'Completa para que sea verdadero cuando x está entre 3 y 10.',
          difficulty: 1,
          payload: {
            template: 'const x = 7;\nconsole.log(x > 3 {{0}} x < 10);',
            blanks: ['&&'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un entero e imprime `true` si está entre 10 y 20 (ambos incluidos), o `false` si no lo está.',
          starterCode: LINEAS,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nconsole.log(n >= 10 && n <= 20);\n`,
          difficulty: 1,
          testCases: [
            { input: '15', expectedOutput: 'true', isHidden: false },
            { input: '25', expectedOutput: 'false', isHidden: false },
            { input: '10', expectedOutput: 'true', isHidden: true },
            { input: '9', expectedOutput: 'false', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un año e imprime `bisiesto` o `no bisiesto`. Un año es bisiesto si es divisible entre 4 y no entre 100, o si es divisible entre 400.',
          starterCode: LINEAS,
          solution: `${LINEAS}const anio = parseInt(lineas[0], 10);\nif ((anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0) {\n  console.log('bisiesto');\n} else {\n  console.log('no bisiesto');\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '2024', expectedOutput: 'bisiesto', isHidden: false },
            { input: '1900', expectedOutput: 'no bisiesto', isHidden: false },
            { input: '2000', expectedOutput: 'bisiesto', isHidden: true },
            { input: '2023', expectedOutput: 'no bisiesto', isHidden: true },
          ],
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas para mostrar un aviso solo si la temperatura está entre 25 y 35.',
          difficulty: 1,
          payload: {
            blocks: [
              'const temperatura = 30;',
              'if (temperatura > 25 && temperatura < 35) {',
              '  console.log("calor agradable");',
              '}',
            ],
          },
        },
        {
          type: 'bug',
          prompt:
            'Esta comparación lanza un error de sintaxis. ¿Qué línea falla?',
          difficulty: 2,
          payload: {
            lines: [
              'const nota = 75;',
              'if (nota > 60 && < 100) {',
              '  console.log("válida");',
              '}',
            ],
            buggyLineIndex: 1,
            explanation:
              'Cada lado de `&&` necesita una comparación completa: `nota > 60 && nota < 100`.',
          },
        },
      ],
    },
    {
      title: 'Pensar como un programa',
      xpReward: 15,
      contentMarkdown: md`
# Pensar como un programa

Antes de escribir código hay que saber **qué pasos** hay que dar. Una lista de pasos ordenados y sin ambigüedad se llama **algoritmo**.

## De la idea al código

Problema: _calcular el total a pagar con un descuento_.

1. Pedir el precio.
2. Pedir el porcentaje de descuento.
3. Calcular cuánto se descuenta.
4. Restar el descuento al precio.
5. Mostrar el resultado.

Cada paso se vuelve una o dos líneas de JavaScript:

§§§javascript
const precio = parseInt(lineas[0], 10);
const porcentaje = parseInt(lineas[1], 10);
const descuento = precio * porcentaje / 100;
const total = precio - descuento;
console.log(total);
§§§

## El orden importa

JavaScript ejecuta **de arriba hacia abajo, una línea a la vez**. No puedes usar una variable declarada con §let§ o §const§ antes de crearla:

§§§javascript
console.log(total); // ReferenceError: Cannot access 'total' before initialization
let total = 10;
§§§

## Trazar un programa

Para entender (o depurar) un programa, sigue los valores línea por línea como una tabla:

§§§javascript
let x = 2;
let y = 3;
x = y;
y = x + 1;
§§§

| Línea       | x   | y   |
| ----------- | --- | --- |
| §let x = 2§ | 2   | –   |
| §let y = 3§ | 2   | 3   |
| §x = y§     | 3   | 3   |
| §y = x + 1§ | 3   | 4   |

## Pseudocódigo

Es una forma de escribir el algoritmo en palabras antes de programar:

§§§text
SI edad >= 18 ENTONCES
mostrar "mayor de edad"
SINO
mostrar "menor de edad"
§§§

Traducirlo a JavaScript es casi directo: §if§, §else§, paréntesis y llaves.

**Consejo:** si no sabes cómo empezar, resuelve el problema a mano con un ejemplo pequeño y anota cada paso que hiciste.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: 'Traza el programa. ¿Qué imprime?',
          difficulty: 2,
          payload: {
            code: 'let x = 2;\nlet y = 3;\nx = y;\ny = x + 1;\nconsole.log(x, y);',
            options: ['2 3', '3 4', '3 3', '2 4'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué ocurre al ejecutar este código?',
          difficulty: 2,
          payload: {
            code: 'console.log(total);\nlet total = 10;',
            options: [
              'Imprime 10',
              'Imprime undefined',
              'Lanza ReferenceError porque total aún no está inicializado',
              'Imprime 0',
            ],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt:
            'Traduce el pseudocódigo `SI edad >= 18 ENTONCES` a JavaScript.',
          difficulty: 1,
          payload: {
            template:
              '{{0}} (edad >= 18) {{1}}\n  console.log("mayor de edad");\n}',
            blanks: ['if', '{'],
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena los pasos del algoritmo: calcular el área de un triángulo.',
          difficulty: 1,
          payload: {
            blocks: [
              'const base = 10;',
              'const altura = 4;',
              'const area = base * altura / 2;',
              'console.log(area);',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un precio y un porcentaje de descuento (enteros, uno por línea) e imprime el total a pagar.',
          starterCode: LINEAS,
          solution: `${LINEAS}const precio = parseInt(lineas[0], 10);\nconst porcentaje = parseInt(lineas[1], 10);\nconst descuento = precio * porcentaje / 100;\nconsole.log(precio - descuento);\n`,
          difficulty: 2,
          testCases: [
            { input: '200\n10', expectedOutput: '180', isHidden: false },
            { input: '50\n20', expectedOutput: '40', isHidden: false },
            { input: '100\n0', expectedOutput: '100', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'FizzBuzz de un número: lee un entero `n`. Si es múltiplo de 3 y de 5 imprime `FizzBuzz`; si solo de 3, `Fizz`; si solo de 5, `Buzz`; en otro caso imprime el número.',
          starterCode: LINEAS,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nif (n % 15 === 0) {\n  console.log('FizzBuzz');\n} else if (n % 3 === 0) {\n  console.log('Fizz');\n} else if (n % 5 === 0) {\n  console.log('Buzz');\n} else {\n  console.log(n);\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '15', expectedOutput: 'FizzBuzz', isHidden: false },
            { input: '9', expectedOutput: 'Fizz', isHidden: false },
            { input: '10', expectedOutput: 'Buzz', isHidden: false },
            { input: '7', expectedOutput: '7', isHidden: true },
            { input: '30', expectedOutput: 'FizzBuzz', isHidden: true },
          ],
        },
      ],
    },
  ],
};
