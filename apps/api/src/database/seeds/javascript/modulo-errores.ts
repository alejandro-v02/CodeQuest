import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { LINEAS } from './common';

export const moduloErrores: SeedModule = {
  title: 'Errores y depuración',
  lessons: [
    {
      title: 'Leer mensajes de error',
      xpReward: 10,
      contentMarkdown: md`
# Leer mensajes de error

Equivocarse es parte de programar: incluso quien lleva años escribiendo código ve errores todos los días. La habilidad no es no cometerlos, sino **leerlos bien**.

## Anatomía de un error

§§§text
/app/main.js:3
console.log(lista[5].toUpperCase());
^

TypeError: Cannot read properties of undefined (reading 'toUpperCase')
at Object.<anonymous> (/app/main.js:3:21)
§§§

1. **El tipo de error y su descripción** (§TypeError: Cannot read properties of undefined§).
2. **El archivo y la línea** donde ocurrió (§main.js:3§), con la línea de código y una flecha §^§ cerca del problema.
3. Las líneas §at ...§ (la _pila de llamadas_) muestran qué función llamó a cuál.

Empieza por el tipo y la descripción (_qué_ pasó) y después mira el archivo y la línea (_dónde_).

## Los errores más comunes

| Error            | Cuándo aparece                                        | Ejemplo                                |
| ---------------- | ----------------------------------------------------- | -------------------------------------- |
| §SyntaxError§    | el código está mal escrito (falta §)§, §}§, comillas) | §if (x > 3§                            |
| §ReferenceError§ | usas una variable que no existe                       | §console.log(totl)§ (por §total§)      |
| §TypeError§      | operación sobre un valor del tipo equivocado          | §undefined.length§, §null.toFixed()§   |
| §RangeError§     | un número fuera del rango permitido                   | recursión infinita, §(1).toFixed(101)§ |

Los errores de §JSON.parse§ son §SyntaxError§: §JSON.parse("{")§.

## Errores que no avisan

JavaScript es muy permisivo: muchas equivocaciones **no lanzan error** y producen valores raros:

- §"5" + 2§ da §"52"§.
- §10 - undefined§ da §NaN§.
- §lista[10]§ en una lista de 3 elementos da §undefined§.

Si ves §NaN§ o §undefined§ donde no lo esperas, ahí hay una pista: algún valor no es lo que crees.

## Primera ayuda

- Relee la línea que indica el error **y las anteriores**.
- Busca letras de más o de menos en los nombres (mayúsculas incluidas: §nombre§ y §Nombre§ son distintos).
- Copia el mensaje de error y búscalo tal cual: casi seguro alguien lo ha tenido antes.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 1,
          payload: {
            code: 'const total = 10;\nconsole.log(totl);',
            options: [
              'SyntaxError',
              'ReferenceError',
              'TypeError',
              'RangeError',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 2,
          payload: {
            code: 'const usuario = undefined;\nconsole.log(usuario.nombre);',
            options: [
              'ReferenceError',
              'SyntaxError',
              'TypeError',
              'No lanza error',
            ],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué error produce este código?',
          difficulty: 2,
          payload: {
            code: 'JSON.parse("{");',
            options: [
              'SyntaxError',
              'TypeError',
              'ReferenceError',
              'RangeError',
            ],
            correctIndex: 0,
          },
        },
        {
          type: 'quiz',
          prompt:
            '¿Qué imprime este código? (no todos los errores son excepciones)',
          difficulty: 2,
          payload: {
            code: 'console.log(10 - undefined);',
            options: ['10', 'undefined', 'NaN', 'TypeError'],
            correctIndex: 2,
          },
        },
        {
          type: 'fill',
          prompt:
            'Corrige el resultado convirtiendo el texto a número antes de sumar.',
          difficulty: 2,
          payload: {
            template: 'const edad = "15";\nconsole.log({{0}}(edad) + 1);',
            blanks: ['Number'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee dos enteros `a` y `b` (uno por línea). Si `b` es 0 imprime `no se puede dividir entre cero`; en caso contrario imprime `a / b` con 2 decimales (`toFixed(2)`).',
          starterCode: `${LINEAS}const [a, b] = lineas.map(Number);\n`,
          solution: `${LINEAS}const [a, b] = lineas.map(Number);\nif (b === 0) {\n  console.log('no se puede dividir entre cero');\n} else {\n  console.log((a / b).toFixed(2));\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '10\n2', expectedOutput: '5.00', isHidden: false },
            {
              input: '7\n0',
              expectedOutput: 'no se puede dividir entre cero',
              isHidden: false,
            },
            { input: '1\n3', expectedOutput: '0.33', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'El programa lanza `TypeError` en la última vuelta del bucle. ¿Qué línea es la causa?',
          difficulty: 2,
          payload: {
            lines: [
              'const lista = [1, 2, 3];',
              'for (let i = 0; i <= lista.length; i++) {',
              '  console.log(lista[i].toFixed(1));',
              '}',
            ],
            buggyLineIndex: 1,
            explanation:
              'La lista tiene 3 elementos (índices 0 a 2) pero el bucle llega hasta `i = 3`: `lista[3]` es `undefined` y `.toFixed()` falla. Debe ser `i < lista.length`.',
          },
        },
        {
          type: 'bug',
          prompt:
            'Debería imprimir 12.5, pero imprime `102.5`. ¿Qué línea es la causa?',
          difficulty: 2,
          payload: {
            lines: [
              'const precio = "10";',
              'const total = precio + 2.5;',
              'console.log(total);',
            ],
            buggyLineIndex: 0,
            explanation:
              '`precio` es un string, así que `+` concatena en vez de sumar: `"10" + 2.5` da `"102.5"` sin lanzar ningún error. El valor debe ser un número: `const precio = 10;` (o `Number("10")`).',
          },
        },
      ],
    },
    {
      title: 'Manejo de excepciones',
      xpReward: 10,
      contentMarkdown: md`
# Manejo de excepciones

Un error que ocurre mientras el programa corre se llama **excepción**. Si no se atiende, el programa se detiene. Con §try§ / §catch§ puedes **atenderla** y seguir.

§§§javascript
try {
const datos = JSON.parse(texto);
console.log(datos.nombre);
} catch (error) {
console.log("Texto inválido:", error.message);
}
§§§

## Cómo funciona

1. JavaScript ejecuta el bloque §try§ línea por línea.
2. Si ocurre una excepción, **salta** al §catch§; el resto del §try§ no se ejecuta.
3. Si no hay error, el §catch§ se ignora.

El objeto §error§ trae §error.message§ (descripción) y §error.name§ (tipo).

## §finally§

§§§javascript
try {
// ...
} catch (error) {
// ...
} finally {
console.log("fin"); // siempre se ejecuta
}
§§§

## Atención: no todo lanza excepciones

Estas operaciones **no** lanzan error; hay que comprobar el resultado:

§§§javascript
Number("abc") // NaN
parseInt("hola", 10) // NaN
[1, 2, 3][10] // undefined
10 / 0 // Infinity
§§§

§§§javascript
const n = Number(texto);
if (Number.isNaN(n)) {
console.log("no es un número");
}
§§§

## Lanzar tus propias excepciones

§§§javascript
function raiz(n) {
if (n < 0) {
throw new Error("n no puede ser negativo");
}
return Math.sqrt(n);
}
§§§

Se lanza con §throw§. **Error típico:** escribir §return new Error(...)§: eso solo _devuelve_ un objeto, no interrumpe nada y el §catch§ nunca se activa.

## Buenas prácticas

- Mete en el §try§ **solo** las líneas que pueden fallar.
- No uses §try§ para ocultar errores de lógica: arréglalos.
- Lanza §Error§ con mensajes claros (§"edad inválida"§, no §"error"§).
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'try {\n  console.log("a");\n  JSON.parse("x");\n  console.log("b");\n} catch (e) {\n  console.log("c");\n} finally {\n  console.log("d");\n}',
            options: ['a b d', 'a c d', 'a b c d', 'a c'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 3,
          payload: {
            code: 'try {\n  console.log(Number("abc"));\n} catch (e) {\n  console.log("error");\n}',
            options: ['error', 'NaN', 'abc', '0'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Atrapa el error de JSON y usa un bloque que siempre se ejecute.',
          difficulty: 2,
          payload: {
            template:
              'try {\n  JSON.parse("{");\n} {{0}} (e) {\n  console.log("inválido");\n} {{1}} {\n  console.log("fin");\n}',
            blanks: ['catch', 'finally'],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un texto. Si se puede interpretar como número, imprime su doble; si no, imprime `invalido`. (Recuerda que `Number("abc")` no lanza excepción.)',
          starterCode: LINEAS,
          solution: `${LINEAS}const n = Number(lineas[0]);\nconsole.log(Number.isNaN(n) ? 'invalido' : n * 2);\n`,
          difficulty: 2,
          testCases: [
            { input: '21', expectedOutput: '42', isHidden: false },
            { input: 'abc', expectedOutput: 'invalido', isHidden: false },
            { input: '-4', expectedOutput: '-8', isHidden: true },
            { input: '12abc', expectedOutput: 'invalido', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Define `dividir(a, b)` que lance `new Error("division por cero")` si `b` es 0 y `new Error("valor invalido")` si algún valor no es un número; si no, devuelve `a / b`. Lee dos valores (uno por línea) e imprime el resultado con 2 decimales, o el mensaje del error si se lanza uno.',
          starterCode: `function dividir(a, b) {\n  // Escribe tu código aquí\n}\n\n${LINEAS}try {\n  console.log(dividir(Number(lineas[0]), Number(lineas[1])).toFixed(2));\n} catch (error) {\n  console.log(error.message);\n}\n`,
          solution: `function dividir(a, b) {\n  if (Number.isNaN(a) || Number.isNaN(b)) {\n    throw new Error('valor invalido');\n  }\n  if (b === 0) {\n    throw new Error('division por cero');\n  }\n  return a / b;\n}\n\n${LINEAS}try {\n  console.log(dividir(Number(lineas[0]), Number(lineas[1])).toFixed(2));\n} catch (error) {\n  console.log(error.message);\n}\n`,
          difficulty: 3,
          testCases: [
            { input: '10\n2', expectedOutput: '5.00', isHidden: false },
            {
              input: '5\n0',
              expectedOutput: 'division por cero',
              isHidden: false,
            },
            {
              input: 'x\n2',
              expectedOutput: 'valor invalido',
              isHidden: false,
            },
            { input: '1\n3', expectedOutput: '0.33', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea que debería ser JSON con una propiedad `nombre`. Si es JSON válido imprime el valor de `nombre`; si no, imprime `json invalido`. Usa `try` / `catch`.',
          starterCode: LINEAS,
          solution: `${LINEAS}try {\n  const datos = JSON.parse(lineas[0]);\n  console.log(datos.nombre);\n} catch (error) {\n  console.log('json invalido');\n}\n`,
          difficulty: 3,
          testCases: [
            {
              input: '{"nombre":"Ana"}',
              expectedOutput: 'Ana',
              isHidden: false,
            },
            {
              input: '{nombre}',
              expectedOutput: 'json invalido',
              isHidden: false,
            },
            {
              input: '{"nombre":"Luis","edad":3}',
              expectedOutput: 'Luis',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee una línea de números y, en la línea siguiente, un índice. Imprime el elemento de esa posición, o `fuera de rango` si no existe. (Acceder a una posición inexistente no lanza error: da `undefined`.)',
          starterCode: `${LINEAS}const lista = lineas[0].split(' ');\nconst indice = parseInt(lineas[1], 10);\n`,
          solution: `${LINEAS}const lista = lineas[0].split(' ');\nconst indice = parseInt(lineas[1], 10);\nconsole.log(lista[indice] ?? 'fuera de rango');\n`,
          difficulty: 2,
          testCases: [
            { input: '10 20 30\n1', expectedOutput: '20', isHidden: false },
            {
              input: '10 20 30\n5',
              expectedOutput: 'fuera de rango',
              isHidden: false,
            },
            { input: '10 20 30\n2', expectedOutput: '30', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere capturar el error cuando se divide entre cero, pero el `catch` nunca se ejecuta. ¿Qué línea tiene el error?',
          difficulty: 3,
          payload: {
            lines: [
              'function dividir(a, b) {',
              '  if (b === 0) {',
              '    return new Error("division por cero");',
              '  }',
              '  return a / b;',
              '}',
              'try {',
              '  dividir(1, 0);',
              '} catch (e) {',
              '  console.log("capturado");',
              '}',
            ],
            buggyLineIndex: 2,
            explanation:
              '`return new Error(...)` solo devuelve un objeto de error, no interrumpe el programa, así que el `catch` nunca se activa. Para lanzar la excepción hay que usar `throw new Error(...)`.',
          },
        },
      ],
    },
    {
      title: 'Depurar tu código',
      xpReward: 15,
      contentMarkdown: md`
# Depurar tu código

**Depurar** (_debugging_) es encontrar y corregir errores. Los más difíciles son los lógicos: el programa corre pero el resultado es incorrecto.

## Método en 5 pasos

1. **Reproduce** el problema con una entrada concreta y pequeña.
2. **Predice** qué debería salir, escrito a mano.
3. **Observa** qué sale realmente.
4. **Localiza** dónde se separan lo esperado y lo real.
5. **Corrige** una sola cosa y vuelve a probar.

## Depurar con §console.log()§

Muestra los valores en puntos clave para ver dónde el programa se aparta de lo que crees:

§§§javascript
let total = 0;
for (const n of [1, 2, 3]) {
console.log("antes:", total, "n:", n); // <- pista de depuración
total = n; // ¿ves el error?
}
console.log(total);
§§§

Al ver §antes: 0 n: 1§, §antes: 1 n: 2§... notas que §total§ nunca acumula: falta §total += n§. Borra los §console.log§ de depuración al terminar.

Otras herramientas útiles: §console.table(arrayDeObjetos)§ muestra una tabla, §typeof valor§ confirma el tipo, y la palabra §debugger§ pausa el programa si usas las herramientas del navegador.

## Errores lógicos frecuentes

- **Off-by-one:** quedarse una vuelta corto o largo (§i < n§ en vez de §i <= n§).
- **Precedencia:** §a + b / 2§ en vez de §(a + b) / 2§.
- **§=§ por §===§:** asignar en vez de comparar.
- **Tipos mezclados:** §"10" + 5§ da §"105"§.
- **Mutar sin querer:** §sort()§ y §reverse()§ **modifican** el array original; copia antes con §[...lista]§.
- **Condición invertida:** §>§ en vez de §<§.
- **Variable no reiniciada:** dejar el contador con el valor de una vuelta anterior.

## Comprobar suposiciones

§§§javascript
function promedio(numeros) {
if (numeros.length === 0) {
throw new Error("la lista no puede estar vacía");
}
return numeros.reduce((s, n) => s + n, 0) / numeros.length;
}
§§§

Si la condición se cumple, el programa se detiene **en ese punto** con tu mensaje, en vez de seguir con datos incorrectos.

## Más trucos

- Prueba con **casos límite**: array vacío, un solo elemento, cero, negativos.
- Explica el código en voz alta, línea a línea (_rubber duck debugging_): muchas veces el error aparece al contarlo.
- Divide el problema: comprueba cada función por separado.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt:
            'El programa corre sin errores pero da un resultado incorrecto. ¿Qué conviene hacer primero?',
          difficulty: 1,
          payload: {
            code: 'function promedio(a, b) {\n  return a + b / 2;\n}\n\nconsole.log(promedio(10, 20));   // imprime 20, se esperaba 15',
            options: [
              'Reinstalar Node.js',
              'Probar con valores sencillos y revisar paso a paso qué calcula cada parte',
              'Borrar la función y empezar de cero',
              'Ignorarlo: no hay mensaje de error',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Cuánto vale `total` al final?',
          difficulty: 2,
          payload: {
            code: 'let total = 0;\nfor (let i = 1; i < 4; i++) {\n  total += i;\n}\nconsole.log(total);',
            options: ['3', '6', '10', '0'],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt: 'Protege la función: lanza un error si `n` no es positivo.',
          difficulty: 2,
          payload: {
            template:
              'function raiz(n) {\n  if (n < 0) {\n    {{0}} new Error("n no puede ser negativo");\n  }\n  return Math.sqrt({{1}});\n}',
            blanks: ['throw', 'n'],
          },
        },
        {
          type: 'code',
          prompt:
            'Este programa debería imprimir la suma de los números del 1 al `n`, pero se queda corto. Corrígelo.',
          starterCode: `${LINEAS}const n = parseInt(lineas[0], 10);\nlet total = 0;\nfor (let i = 1; i < n; i++) {\n  total += i;\n}\nconsole.log(total);\n`,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nlet total = 0;\nfor (let i = 1; i <= n; i++) {\n  total += i;\n}\nconsole.log(total);\n`,
          difficulty: 2,
          testCases: [
            { input: '4', expectedOutput: '10', isHidden: false },
            { input: '1', expectedOutput: '1', isHidden: false },
            { input: '10', expectedOutput: '55', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa debería imprimir el promedio de una línea de enteros, pero el resultado es incorrecto. Corrígelo.',
          starterCode: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nlet total = 0;\nfor (const n of numeros) {\n  total = n;\n}\nconsole.log(total / numeros.length);\n`,
          solution: `${LINEAS}const numeros = lineas[0].split(' ').map(Number);\nlet total = 0;\nfor (const n of numeros) {\n  total += n;\n}\nconsole.log(total / numeros.length);\n`,
          difficulty: 2,
          testCases: [
            { input: '4 6', expectedOutput: '5', isHidden: false },
            { input: '10 20 30', expectedOutput: '20', isHidden: false },
            { input: '7', expectedOutput: '7', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Debería imprimir los números pares del 1 al `n` (uno por línea), pero imprime los impares y se queda corto. Corrígelo.',
          starterCode: `${LINEAS}const n = parseInt(lineas[0], 10);\nfor (let i = 1; i < n; i++) {\n  if (i % 2 === 1) {\n    console.log(i);\n  }\n}\n`,
          solution: `${LINEAS}const n = parseInt(lineas[0], 10);\nfor (let i = 1; i <= n; i++) {\n  if (i % 2 === 0) {\n    console.log(i);\n  }\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '6', expectedOutput: '2\n4\n6', isHidden: false },
            { input: '2', expectedOutput: '2', isHidden: false },
            { input: '9', expectedOutput: '2\n4\n6\n8', isHidden: true },
          ],
        },
        {
          type: 'bug',
          prompt:
            'Se quiere comprobar que el array original no cambió, pero `original[0]` ya no es 3. ¿Qué línea es la causa?',
          difficulty: 3,
          payload: {
            lines: [
              'const original = [3, 1, 2];',
              'const ordenado = original.sort();',
              'console.log(original[0]);',
            ],
            buggyLineIndex: 1,
            explanation:
              '`sort()` modifica el array original y además devuelve esa misma referencia: `ordenado` y `original` son el mismo array. Para conservar el original hay que copiar antes: `[...original].sort()`.',
          },
        },
      ],
    },
  ],
};
