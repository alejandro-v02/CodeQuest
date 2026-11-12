import type { SeedModule } from '../curriculum.data';
import { md } from '../md';
import { ENTRADA } from './common';

export const moduloErrores: SeedModule = {
  title: 'Errores y depuración',
  lessons: [
    {
      title: 'Leer errores del compilador',
      xpReward: 10,
      contentMarkdown: md`
# Leer errores del compilador

En TypeScript, muchos errores aparecen **antes de ejecutar el programa**, cuando el compilador revisa tu código. Aprender a leerlos es la mitad del trabajo.

## Anatomía de un error

§§§text
main.ts(3,7): error TS2322: Type 'string' is not assignable to type 'number'.
§§§

1. **Dónde**: §main.ts(3,7)§ es el archivo, la **línea 3** y la **columna 7**.
2. **Código del error**: §TS2322§. Cada tipo de error tiene un número fijo; puedes buscarlo tal cual.
3. **Qué pasó**: el mensaje en inglés. Casi siempre dice _qué tipo esperaba_ y _cuál recibió_.

Empieza siempre por la línea y por el final del mensaje: ahí está el tipo que no encaja.

## Los errores más comunes

| Código   | Mensaje (resumido)                                   | Qué significa                                        |
| -------- | ---------------------------------------------------- | ---------------------------------------------------- |
| §TS2322§ | Type 'X' is not assignable to type 'Y'               | guardas un valor del tipo equivocado                 |
| §TS2345§ | Argument of type 'X' is not assignable…              | pasas a una función un argumento del tipo equivocado |
| §TS2554§ | Expected 2 arguments, but got 1                      | llamas a la función con argumentos de más o de menos |
| §TS2339§ | Property 'x' does not exist on type 'Y'              | usas una propiedad que ese tipo no tiene             |
| §TS2551§ | … Did you mean 'nombre'?                             | igual que TS2339, pero hay un nombre parecido        |
| §TS2304§ | Cannot find name 'x'                                 | usas una variable que no existe (¿errata?)           |
| §TS2355§ | A function whose declared type … must return a value | a una función le falta el §return§                   |

## Cómo arreglarlos

- **TS2322 / TS2345**: revisa el tipo de la variable o del parámetro. ¿Está bien el valor o está mal la anotación?
- **TS2554**: cuenta los parámetros de la función y los argumentos de la llamada.
- **TS2339 / TS2551 / TS2304**: casi siempre es una errata. Mira las mayúsculas.
- Si hay **varios errores**, arregla primero el de más arriba: a veces uno provoca a los demás.

## Errores que el compilador no ve

El compilador comprueba tipos, no lógica. Este código compila, pero está mal:

§§§typescript
function promedio(a: number, b: number): number {
return a + b / 2; // falta el paréntesis: (a + b) / 2
}
§§§

Para esos errores sigues necesitando probar el programa con distintos valores.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿En qué línea y columna se produce este error?',
          difficulty: 1,
          payload: {
            code: "main.ts(5,12): error TS2322: Type 'string' is not assignable to type 'number'.",
            options: [
              'Línea 12, columna 5',
              'Línea 5, columna 12',
              'Línea 2322',
              'En todas las líneas',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué error indica el compilador con este código?',
          difficulty: 1,
          payload: {
            code: 'function f(a: number, b: number): number {\n  return a + b;\n}\nf(1);',
            options: [
              'TS2322: tipo no asignable',
              'TS2554: se esperaban 2 argumentos y se recibió 1',
              'TS2304: no se encuentra el nombre f',
              'No hay error',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué significa este mensaje?',
          difficulty: 2,
          payload: {
            code: "error TS2551: Property 'nombr' does not exist on type '{ nombre: string; }'. Did you mean 'nombre'?",
            options: [
              'Falta declarar el objeto',
              'Hay una errata: la propiedad se llama nombre',
              'nombre debe ser un number',
              'El objeto es de solo lectura',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Este código compila? ¿Hace lo que parece?',
          difficulty: 3,
          payload: {
            code: 'function promedio(a: number, b: number): number {\n  return a + b / 2;\n}',
            options: [
              'No compila: falta un paréntesis',
              'Compila, pero calcula mal el promedio (error lógico)',
              'No compila: b / 2 no es un number',
              'Compila y calcula bien el promedio',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'bug',
          prompt:
            'El compilador responde TS2304 (Cannot find name). ¿Qué línea tiene la errata?',
          difficulty: 2,
          payload: {
            lines: [
              'const total: number = 10;',
              'const iva: number = total * 0.19;',
              'console.log(totl + iva);',
            ],
            buggyLineIndex: 2,
            explanation: 'La variable se llama total, no totl.',
          },
        },
        {
          type: 'bug',
          prompt:
            'El compilador responde TS2355 (la función debe devolver un valor). ¿Qué línea tiene el problema?',
          difficulty: 3,
          payload: {
            lines: [
              'function doble(n: number): number {',
              '  const r: number = n * 2;',
              '}',
              'console.log(doble(4));',
            ],
            buggyLineIndex: 0,
            explanation:
              'La función promete devolver un number pero nunca ejecuta return. Hay que añadir return r;',
          },
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (TS2322). Corrígelo para que lea un número e imprima su doble.',
          starterCode: `${ENTRADA}const n: number = Number(lineas[0]);\nconst doble: string = n * 2;\nconsole.log(doble);\n`,
          solution: `${ENTRADA}const n: number = Number(lineas[0]);\nconst doble: number = n * 2;\nconsole.log(doble);\n`,
          difficulty: 1,
          testCases: [
            { input: '4', expectedOutput: '8', isHidden: false },
            { input: '-3', expectedOutput: '-6', isHidden: false },
            { input: '0', expectedOutput: '0', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (TS2551). Corrígelo para que imprima `<nombre> tiene <edad> años`.',
          starterCode: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nconst p: Persona = { nombre: lineas[0], edad: Number(lineas[1]) };\nconsole.log(\`\${p.nombr} tiene \${p.edad} años\`);\n`,
          solution: `${ENTRADA}interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nconst p: Persona = { nombre: lineas[0], edad: Number(lineas[1]) };\nconsole.log(\`\${p.nombre} tiene \${p.edad} años\`);\n`,
          difficulty: 1,
          testCases: [
            {
              input: 'Ana\n20',
              expectedOutput: 'Ana tiene 20 años',
              isHidden: false,
            },
            {
              input: 'Luis\n31',
              expectedOutput: 'Luis tiene 31 años',
              isHidden: true,
            },
          ],
        },
        {
          type: 'code',
          prompt:
            'Este programa no compila (TS2554) y además tiene un error lógico. Corrígelo para que imprima el promedio de dos notas con 1 decimal.',
          starterCode: `${ENTRADA}function promedio(a: number, b: number): number {\n  return a + b / 2;\n}\n\nconst a: number = Number(lineas[0]);\nconsole.log(promedio(a).toFixed(1));\n`,
          solution: `${ENTRADA}function promedio(a: number, b: number): number {\n  return (a + b) / 2;\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\nconsole.log(promedio(a, b).toFixed(1));\n`,
          difficulty: 2,
          testCases: [
            { input: '4\n5', expectedOutput: '4.5', isHidden: false },
            { input: '3\n3', expectedOutput: '3.0', isHidden: false },
            { input: '10\n0', expectedOutput: '5.0', isHidden: true },
          ],
        },
      ],
    },
    {
      title: 'Excepciones y unknown',
      xpReward: 10,
      contentMarkdown: md`
# Excepciones y unknown

Algunos errores solo se descubren **mientras el programa corre**: un texto que no es JSON válido, una división que no debería hacerse… Para eso están las excepciones.

## try / catch / finally

§§§typescript
try {
const datos = JSON.parse("{"); // lanza un error
console.log("ok");
} catch (error) {
console.log("no se pudo leer");
} finally {
console.log("esto siempre se ejecuta");
}
§§§

- §try§: el código que podría fallar.
- §catch§: qué hacer si falla; recibe el error.
- §finally§: se ejecuta siempre, haya o no error.

## Lanzar tus propios errores

§§§typescript
function dividir(a: number, b: number): number {
if (b === 0) {
throw new Error("No se puede dividir entre cero");
}
return a / b;
}

try {
dividir(5, 0);
} catch (error) {
console.log((error as Error).message);
}
§§§

§throw§ detiene la función y salta al §catch§ más cercano.

## El tipo unknown

Cuando no sabes qué tipo tiene un valor (por ejemplo, lo que llega de fuera), usa §unknown§ en vez de §any§. Es "no sé qué es, y no me dejes usarlo sin comprobarlo":

§§§typescript
let x: unknown = 5;
x.toFixed(1); // Error: 'x' is of type 'unknown'.

if (typeof x === "number") {
x.toFixed(1); // válido: ya sabemos que es number
}
§§§

Con §any§ ese error no aparecería, y un fallo se descubriría tarde. §unknown§ te obliga a comprobar primero: es la opción segura.

## Comprobar el error de un catch

Lo que se captura puede ser cualquier cosa, no solo un §Error§. La forma segura de leerlo:

§§§typescript
try {
dividir(5, 0);
} catch (error: unknown) {
if (error instanceof Error) {
console.log(error.message);
} else {
console.log("error desconocido");
}
}
§§§

## Cuándo usar excepciones

- Para situaciones **excepcionales** (datos corruptos, valores imposibles).
- No para el flujo normal: comprobar con un §if§ si algo existe es más claro que provocar un error.
      `,
      exercises: [
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 1,
          payload: {
            code: 'try {\n  console.log("a");\n} finally {\n  console.log("b");\n}',
            options: ['a', 'b', 'a b (cada una en su línea)', 'Nada'],
            correctIndex: 2,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué imprime este código?',
          difficulty: 2,
          payload: {
            code: 'try {\n  JSON.parse("{");\n  console.log("ok");\n} catch (e) {\n  console.log("invalido");\n}',
            options: ['ok', 'invalido', 'ok invalido', 'Nada'],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Qué hace el compilador con esta línea?',
          difficulty: 2,
          payload: {
            code: 'let x: unknown = 5;\nconsole.log(x.toFixed(1));',
            options: [
              'Imprime 5.0',
              'Marca un error: no se puede usar x sin comprobar su tipo',
              'Imprime undefined',
              'Convierte x a number',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'quiz',
          prompt: '¿Por qué `unknown` es más seguro que `any`?',
          difficulty: 2,
          payload: {
            code: 'let a: any = 5;\nlet u: unknown = 5;',
            options: [
              'Porque ocupa menos memoria',
              'Porque obliga a comprobar el tipo antes de usar el valor',
              'Porque solo acepta números',
              'No hay ninguna diferencia',
            ],
            correctIndex: 1,
          },
        },
        {
          type: 'fill',
          prompt:
            'Completa el bloque que lanza un error cuando el divisor es cero.',
          difficulty: 2,
          payload: {
            template:
              'if (b === 0) {\n  {{0}} new Error("No se puede dividir entre cero");\n}',
            blanks: ['throw'],
          },
        },
        {
          type: 'sort',
          prompt:
            'Ordena las líneas del bloque que intenta leer un JSON y avisa si falla.',
          difficulty: 2,
          payload: {
            blocks: [
              'try {',
              '  JSON.parse(texto);',
              '  console.log("valido");',
              '} catch (e) {',
              '  console.log("invalido");',
              '}',
            ],
          },
        },
        {
          type: 'code',
          prompt:
            'Lee un texto e imprime `valido` si es un JSON correcto o `invalido` si no lo es.',
          starterCode: `${ENTRADA}const texto: string = lineas[0];\n`,
          solution: `${ENTRADA}const texto: string = lineas[0];\ntry {\n  JSON.parse(texto);\n  console.log('valido');\n} catch (e) {\n  console.log('invalido');\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '{"a": 1}', expectedOutput: 'valido', isHidden: false },
            { input: '{"a": ', expectedOutput: 'invalido', isHidden: false },
            { input: '[1, 2, 3]', expectedOutput: 'valido', isHidden: true },
            { input: 'hola', expectedOutput: 'invalido', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee dos números. Si el segundo es 0, la función `dividir` lanza un error y el programa imprime el mensaje del error; si no, imprime el cociente.',
          starterCode: `${ENTRADA}function dividir(a: number, b: number): number {\n  // TODO: lanza new Error("No se puede dividir entre cero") si b es 0\n  return a / b;\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\ntry {\n  console.log(dividir(a, b));\n} catch (error: unknown) {\n  if (error instanceof Error) {\n    console.log(error.message);\n  }\n}\n`,
          solution: `${ENTRADA}function dividir(a: number, b: number): number {\n  if (b === 0) {\n    throw new Error('No se puede dividir entre cero');\n  }\n  return a / b;\n}\n\nconst a: number = Number(lineas[0]);\nconst b: number = Number(lineas[1]);\ntry {\n  console.log(dividir(a, b));\n} catch (error: unknown) {\n  if (error instanceof Error) {\n    console.log(error.message);\n  }\n}\n`,
          difficulty: 2,
          testCases: [
            { input: '10\n4', expectedOutput: '2.5', isHidden: false },
            {
              input: '5\n0',
              expectedOutput: 'No se puede dividir entre cero',
              isHidden: false,
            },
            { input: '9\n3', expectedOutput: '3', isHidden: true },
          ],
        },
        {
          type: 'code',
          prompt:
            'Lee un valor y descríbelo con la función `describir(x: unknown)`: imprime `numero`, `texto` o `otro` (usa `typeof`). Si la entrada se puede convertir a número, es `numero`; en otro caso es `texto`; si la entrada está vacía, es `otro`.',
          starterCode: `${ENTRADA}function describir(x: unknown): string {\n  // TODO\n}\n\nconst entrada: string = lineas[0];\nlet valor: unknown;\nif (entrada === '') {\n  valor = undefined;\n} else if (isNaN(Number(entrada))) {\n  valor = entrada;\n} else {\n  valor = Number(entrada);\n}\nconsole.log(describir(valor));\n`,
          solution: `${ENTRADA}function describir(x: unknown): string {\n  if (typeof x === 'number') {\n    return 'numero';\n  }\n  if (typeof x === 'string') {\n    return 'texto';\n  }\n  return 'otro';\n}\n\nconst entrada: string = lineas[0];\nlet valor: unknown;\nif (entrada === '') {\n  valor = undefined;\n} else if (isNaN(Number(entrada))) {\n  valor = entrada;\n} else {\n  valor = Number(entrada);\n}\nconsole.log(describir(valor));\n`,
          difficulty: 3,
          testCases: [
            { input: '42', expectedOutput: 'numero', isHidden: false },
            { input: 'hola', expectedOutput: 'texto', isHidden: false },
            { input: '3.5', expectedOutput: 'numero', isHidden: true },
          ],
        },
      ],
    },
  ],
};
