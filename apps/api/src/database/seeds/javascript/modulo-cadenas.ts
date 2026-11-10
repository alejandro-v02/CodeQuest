import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

export const moduloCadenas: SeedModule = {
  title: 'Cadenas de texto',
  lessons: [
    {
      title: 'Operaciones con strings',
      xpReward: 10,
      contentMarkdown: md`
# Operaciones con strings

Un **string** es una secuencia de caracteres entre comillas simples, dobles o backticks.

§§§javascript
const saludo = "Hola";
const otro = 'mundo';
§§§

## Operaciones básicas

§§§javascript
"hola mundo".length // 10 (cuenta también el espacio)
"Hola" + " " + "mundo" // "Hola mundo" (concatenar)
"ja".repeat(3) // "jajaja" (repetir)
"casa".includes("a") // true (contiene)
§§§

## Mayúsculas, minúsculas y espacios

§§§javascript
const nombre = " Ana María ";
nombre.toUpperCase() // " ANA MARÍA "
nombre.toLowerCase() // " ana maría "
nombre.trim() // "Ana María" (quita espacios de los extremos)
§§§

Los métodos **no modifican** el string original: devuelven uno nuevo. Hay que guardar el resultado:

§§§javascript
let texto = " hola ";
texto = texto.trim();
§§§

## Los strings son inmutables

No puedes cambiar un carácter "en el sitio". Lo peligroso es que JavaScript **no avisa**: simplemente lo ignora.

§§§javascript
let palabra = "casa";
palabra[0] = "m"; // se ignora sin error
console.log(palabra); // "casa"
palabra = "m" + palabra.slice(1); // forma correcta: crear uno nuevo
§§§

## Comparar

§"a" === "a"§ es §true§. Se distinguen mayúsculas: §"Hola" === "hola"§ es §false§. Para comparar sin importar mayúsculas, pasa ambos a §toLowerCase()§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log("hola mundo".length);',
            options: ['9', '10', '11', '2'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log("ab".repeat(3));',
            options: ['ab3', 'ababab', 'aaabbb', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Pasa el texto a mayúsculas.',
          difficulty: 1,
          payload: {
            template: 'console.log("hola".{{0}}());',
            blanks: ['toUpperCase'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime su longitud y la palabra en mayúsculas, separadas por un espacio.',
          starterCode: LINEAS,
          solution: `${LINEAS}const palabra = lineas[0];\nconsole.log(palabra.length, palabra.toUpperCase());\n`,
          difficulty: 1,
          testCases: [
            { input: 'hola', expectedOutput: '4 HOLA', isHidden: false },
            { input: 'python', expectedOutput: '6 PYTHON', isHidden: false },
            { input: 'a', expectedOutput: '1 A', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra y un número entero `n` (uno por línea) e imprime la palabra repetida `n` veces, sin separadores.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].repeat(parseInt(lineas[1], 10)));\n`,
          difficulty: 1,
          testCases: [
            { input: 'ja\n3', expectedOutput: 'jajaja', isHidden: false },
            { input: 'ho\n2', expectedOutput: 'hoho', isHidden: false },
            { input: 'x\n5', expectedOutput: 'xxxxx', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos palabras (una por línea) e imprime `iguales` si son la misma sin importar mayúsculas o minúsculas, o `distintas` si no.',
          starterCode: LINEAS,
          solution: `${LINEAS}if (lineas[0].toLowerCase() === lineas[1].toLowerCase()) {\n  console.log('iguales');\n} else {\n  console.log('distintas');\n}\n`,
          difficulty: 2,
          testCases: [
            { input: 'Hola\nhOLA', expectedOutput: 'iguales', isHidden: false },
            {
              input: 'casa\ncasas',
              expectedOutput: 'distintas',
              isHidden: false,
            },
            {
              input: 'PYTHON\npython',
              expectedOutput: 'iguales',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere cambiar la primera letra de "Ana" por "E" (para obtener "Ena"), pero el programa imprime "Ana". ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'let nombre = "Ana";',
              'nombre[0] = "E";',
              'console.log(nombre);',
            ],
            buggyLineIndex: 1,
            explanation:
              'Los strings son inmutables y JavaScript ignora la asignación por índice sin avisar. Hay que crear uno nuevo: `nombre = "E" + nombre.slice(1);`.',
          },
        },
      ],
    },
    {
      title: 'Índices y slice de strings',
      xpReward: 10,
      contentMarkdown: md`
# Índices y slice de strings

Cada carácter de un string tiene una **posición** (índice). Se empieza a contar en **0**:

| P   | y   | t   | h   | o   | n   |
| --- | --- | --- | --- | --- | --- |
| 0   | 1   | 2   | 3   | 4   | 5   |

§§§javascript
const palabra = "Python";
palabra[0] // "P"
palabra[5] // "n"
palabra.at(-1) // "n" (el último; §at§ acepta negativos)
palabra[6] // undefined (no existe, sin error)
palabra[-1] // undefined (los corchetes no aceptan negativos)
§§§

## §slice()§: tomar un trozo

§texto.slice(inicio, fin)§ incluye §inicio§ y **excluye** §fin§:

§§§javascript
palabra.slice(1, 4) // "yth"
palabra.slice(0, 2) // "Py" (desde el principio)
palabra.slice(3) // "hon" (hasta el final)
palabra.slice(-3) // "hon" (últimos tres)
§§§

## Dar la vuelta a un texto

JavaScript no tiene §[::-1]§. Se convierte en array, se invierte y se vuelve a unir:

§§§javascript
palabra.split("").reverse().join("") // "nohtyP"
§§§

## Recorrer un string

§§§javascript
for (let i = 0; i < palabra.length; i++) {
console.log(i, palabra[i]);
}

for (const letra of palabra) {
console.log(letra);
}
§§§

**Cuidado:** acceder a una posición inexistente da §undefined§, y llamar un método sobre §undefined§ (§palabra[10].toUpperCase()§) lanza un §TypeError§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log("python".slice(1, 4));',
            options: ['pyt', 'yth', 'ytho', 'tho'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log("python"[-1]);',
            options: ['n', 'p', 'undefined', 'Error'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt: 'Obtén la última letra y el texto al revés.',
          difficulty: 2,
          payload: {
            template:
              'const palabra = "hola";\nconsole.log(palabra.{{0}}(-1));   // a\nconsole.log(palabra.split("").{{1}}().join(""));   // aloh',
            blanks: ['at', 'reverse'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime su primera y su última letra juntas.',
          starterCode: LINEAS,
          solution: `${LINEAS}const palabra = lineas[0];\nconsole.log(palabra[0] + palabra.at(-1));\n`,
          difficulty: 1,
          testCases: [
            { input: 'hola', expectedOutput: 'ha', isHidden: false },
            { input: 'python', expectedOutput: 'pn', isHidden: false },
            { input: 'ab', expectedOutput: 'ab', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt: 'Lee un texto e imprímelo al revés.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].split('').reverse().join(''));\n`,
          difficulty: 2,
          testCases: [
            { input: 'hola', expectedOutput: 'aloh', isHidden: false },
            { input: 'abc def', expectedOutput: 'fed cba', isHidden: false },
            { input: 'a', expectedOutput: 'a', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra (en minúsculas, sin espacios) e imprime `palindromo` si se lee igual al derecho y al revés, o `no palindromo` si no.',
          starterCode: LINEAS,
          solution: `${LINEAS}const palabra = lineas[0];\nconst alReves = palabra.split('').reverse().join('');\nconsole.log(palabra === alReves ? 'palindromo' : 'no palindromo');\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'reconocer',
              expectedOutput: 'palindromo',
              isHidden: false,
            },
            {
              input: 'python',
              expectedOutput: 'no palindromo',
              isHidden: false,
            },
            { input: 'oso', expectedOutput: 'palindromo', isHidden: true },
            { input: 'ab', expectedOutput: 'no palindromo', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una palabra e imprime sus primeras 3 letras en mayúsculas (o todas, si tiene menos de 3).',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].slice(0, 3).toUpperCase());\n`,
          difficulty: 2,
          testCases: [
            { input: 'programa', expectedOutput: 'PRO', isHidden: false },
            { input: 'ab', expectedOutput: 'AB', isHidden: false },
            { input: 'sol', expectedOutput: 'SOL', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            '"hola" tiene 4 letras, pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 2,
          payload: {
            lines: [
              'const palabra = "hola";',
              'console.log(palabra[0].toUpperCase());',
              'console.log(palabra[4].toUpperCase());',
            ],
            buggyLineIndex: 2,
            explanation:
              'Los índices válidos van de 0 a 3. `palabra[4]` es `undefined`, y `undefined.toUpperCase()` lanza TypeError. La última letra es `palabra[3]` o `palabra.at(-1)`.',
          },
        },
      ],
    },
    {
      title: 'Métodos de texto',
      xpReward: 10,
      contentMarkdown: md`
# Métodos de texto

Los strings traen muchos métodos listos para usar.

## Dividir y unir

§§§javascript
"a,b,c".split(",") // ["a", "b", "c"]
"hola mundo".split(" ") // ["hola", "mundo"]
["x", "y", "z"].join("-") // "x-y-z"
§§§

§split()§ devuelve un **array**; §join()§ hace lo contrario.

## Buscar y reemplazar

§§§javascript
const frase = "banana";
frase.replaceAll("a", "o") // "bonono"
frase.replace("a", "o") // "bonana" (solo la primera)
frase.indexOf("n") // 2 (posición; -1 si no existe)
frase.includes("nan") // true
frase.startsWith("ba") // true
frase.endsWith("na") // true
§§§

## Rellenar y limpiar

§§§javascript
"7".padStart(3, "0") // "007"
"ab".padEnd(5, ".") // "ab..."
" hola ".trim() // "hola"
§§§

## Encadenar métodos

§§§javascript
const entrada = " JUAN ";
const limpio = entrada.trim().toLowerCase(); // "juan"
§§§

## Primera letra en mayúscula

JavaScript no trae §capitalize§; se arma con lo que ya sabes:

§§§javascript
const palabra = "hola";
const titulo = palabra[0].toUpperCase() + palabra.slice(1); // "Hola"
§§§

**Error típico:** §"a-b-c".split()§ sin separador no divide: devuelve §["a-b-c"]§ (un solo elemento).
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log("a,b,c".split(",").length);',
            options: ['1', '3', '5', '0'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'console.log(["x", "y"].join("-"));',
            options: ['xy', 'x-y', "[ 'x', 'y' ]", '-xy-'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Reemplaza todas las "a" por "o" y comprueba si "hola" empieza por "h".',
          difficulty: 2,
          payload: {
            template:
              'console.log("banana".{{0}}("a", "o"));\nconsole.log("hola".{{1}}("h"));',
            blanks: ['replaceAll', 'startsWith'],
          },
        },
        {
          type: 'code',
          prompt: 'Lee una frase e imprime cuántas palabras tiene.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].split(' ').length);\n`,
          difficulty: 1,
          testCases: [
            { input: 'hola mundo cruel', expectedOutput: '3', isHidden: false },
            { input: 'uno', expectedOutput: '1', isHidden: false },
            { input: 'a b c d e', expectedOutput: '5', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase e imprímela reemplazando los espacios por guiones bajos.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].replaceAll(' ', '_'));\n`,
          difficulty: 1,
          testCases: [
            {
              input: 'mi nombre es Ana',
              expectedOutput: 'mi_nombre_es_Ana',
              isHidden: false,
            },
            { input: 'hola', expectedOutput: 'hola', isHidden: false },
            { input: 'a b', expectedOutput: 'a_b', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una frase e imprime cada palabra con la primera letra en mayúscula.',
          starterCode: LINEAS,
          solution: `${LINEAS}const resultado = lineas[0]\n  .split(' ')\n  .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1))\n  .join(' ');\nconsole.log(resultado);\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'hola mundo',
              expectedOutput: 'Hola Mundo',
              isHidden: false,
            },
            {
              input: 'python es genial',
              expectedOutput: 'Python Es Genial',
              isHidden: false,
            },
            { input: 'sol', expectedOutput: 'Sol', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un correo e imprime `valido` si contiene `@` y termina en `.com`; en caso contrario `invalido`.',
          starterCode: LINEAS,
          solution: `${LINEAS}const correo = lineas[0];\nif (correo.includes('@') && correo.endsWith('.com')) {\n  console.log('valido');\n} else {\n  console.log('invalido');\n}\n`,
          difficulty: 2,
          testCases: [
            {
              input: 'ana@correo.com',
              expectedOutput: 'valido',
              isHidden: false,
            },
            {
              input: 'ana.correo.com',
              expectedOutput: 'invalido',
              isHidden: false,
            },
            {
              input: 'ana@correo.org',
              expectedOutput: 'invalido',
              isHidden: true,
            },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere imprimir la segunda parte ("B") en mayúsculas, pero el programa falla. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'const texto = "a-b-c";',
              'const partes = texto.split();',
              'console.log(partes[1].toUpperCase());',
            ],
            buggyLineIndex: 1,
            explanation:
              'Sin separador, `split()` no divide el texto: devuelve `["a-b-c"]`, así que `partes[1]` es `undefined` y `.toUpperCase()` falla. Hay que indicar el separador: `texto.split("-")`.',
          },
        },
      ],
    },
    {
      title: 'Plantillas y formato de texto',
      xpReward: 10,
      contentMarkdown: md`
# Plantillas y formato de texto

Una **plantilla** (_template literal_) usa **backticks** en vez de comillas y permite insertar variables y expresiones con §\${...}§:

§§§javascript
const nombre = "Ana";
const edad = 20;
console.log(\`\${nombre} tiene \${edad} años\`);
console.log(\`El año que viene tendrá \${edad + 1}\`);
§§§

También admiten varias líneas sin trucos:

§§§javascript
const mensaje = \`Hola
mundo\`;
§§§

Con comillas normales, §"\${nombre}"§ se imprime tal cual, sin reemplazar nada.

## Controlar el formato

| Necesitas          | Cómo                                | Resultado     |
| ------------------ | ----------------------------------- | ------------- |
| 2 decimales        | §(3.14159).toFixed(2)§              | §"3.14"§      |
| Rellenar con ceros | §"42".padStart(5, "0")§             | §"00042"§     |
| Porcentaje         | §(0.256 * 100).toFixed(1) + "%"§    | §"25.6%"§     |
| Miles              | §(1234567).toLocaleString("en-US")§ | §"1,234,567"§ |

§toFixed()§ devuelve un **string**, no un número.

## Alinear en columnas

§§§javascript
console.log("Ana".padEnd(10) + String(42).padStart(5));
// "Ana " + " 42"
§§§

- §padEnd(n)§ rellena a la derecha (texto a la izquierda).
- §padStart(n)§ rellena a la izquierda (número a la derecha).
- Los números hay que convertirlos con §String()§ antes de rellenar.

## Cuándo usarlas

Casi siempre que mezcles texto con valores: son más legibles que concatenar con §+§.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'const x = 2;\nconsole.log(`${x + 3}`);',
            options: ['${x + 3}', '5', '2 + 3', 'Error'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'console.log((3.14159).toFixed(2));',
            options: ['3', '3.1', '3.14', '3.14159'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt:
            'Muestra el precio con 2 decimales y rellena con ceros a la izquierda.',
          difficulty: 2,
          payload: {
            template:
              'const precio = 9.5;\nconsole.log(precio.{{0}}(2));   // 9.50\nconsole.log("7".{{1}}(3, "0"));  // 007',
            blanks: ['toFixed', 'padStart'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un precio (decimal) e imprime `Total: $X` con exactamente 2 decimales.',
          starterCode: LINEAS,
          solution: `${LINEAS}const precio = parseFloat(lineas[0]);\nconsole.log(\`Total: $\${precio.toFixed(2)}\`);\n`,
          difficulty: 2,
          testCases: [
            { input: '9.5', expectedOutput: 'Total: $9.50', isHidden: false },
            { input: '10', expectedOutput: 'Total: $10.00', isHidden: false },
            {
              input: '3.14159',
              expectedOutput: 'Total: $3.14',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un nombre y un entero (uno por línea). Imprime el nombre alineado a la izquierda en 10 columnas seguido del número alineado a la derecha en 5 columnas.',
          starterCode: LINEAS,
          solution: `${LINEAS}console.log(lineas[0].padEnd(10) + lineas[1].padStart(5));\n`,
          difficulty: 3,
          testCases: [
            {
              input: 'Ana\n42',
              expectedOutput: 'Ana' + ' '.repeat(10) + '42',
              isHidden: false,
            },
            {
              input: 'Luis\n7',
              expectedOutput: 'Luis' + ' '.repeat(10) + '7',
              isHidden: false,
            },
            {
              input: 'Eva\n12345',
              expectedOutput: 'Eva       12345',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee los aciertos y el total de preguntas (enteros, uno por línea) e imprime el porcentaje de aciertos con 1 decimal, por ejemplo `70.0%`.',
          starterCode: LINEAS,
          solution: `${LINEAS}const aciertos = parseInt(lineas[0], 10);\nconst total = parseInt(lineas[1], 10);\nconsole.log((aciertos / total * 100).toFixed(1) + '%');\n`,
          difficulty: 3,
          testCases: [
            { input: '7\n10', expectedOutput: '70.0%', isHidden: false },
            { input: '1\n3', expectedOutput: '33.3%', isHidden: false },
            { input: '5\n5', expectedOutput: '100.0%', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa debería mostrar `Edad: 25`, pero muestra `Edad: ${edad}`. ¿Qué línea tiene el error?',
          difficulty: 1,
          payload: {
            lines: ['const edad = 25;', 'console.log("Edad: ${edad}");'],
            buggyLineIndex: 1,
            explanation:
              'Las plantillas solo funcionan con backticks. Con comillas normales `${edad}` se imprime literalmente. Debe ser console.log(`Edad: ${edad}`).',
          },
        },
      ],
    },
  ],
};
