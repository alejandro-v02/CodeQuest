# TypeScript en el sandbox (Piston)

Notas para quien escriba ejercicios de TypeScript o toque la ejecución.

## Cómo se ejecuta

Piston compila el archivo con `tsc` (TypeScript 5.0.3) y luego lo ejecuta con Node. Un **error de tipos impide la ejecución**: el mensaje del compilador llega como salida del programa, por ejemplo `main.ts.ts(5,7): error TS2322: ...`. Es intencional: es lo que enseña la ruta de TypeScript.

## Límites del entorno

- **Sin tipos de Node.** `require` no existe para el compilador y hay que declararlo.
- **Target ES5 y librerías por defecto.** `Map`, `Set`, `Promise`, `includes()` o `padStart()` no compilan salvo que se cargue la librería.
- **Modo no estricto.** `null`/`undefined` no se comprueban, y `any` implícito está permitido; no se puede enseñar ahí un error de `strictNullChecks`.
- **Recorrer `Map`/`Set` con `for...of` o `...` no compila** con target ES5: hay que usar `Array.from(...)` o `forEach`.
- **Cada ejecución tarda ~2 s** (compilación incluida). El verificador usa menos trabajos en paralelo para TypeScript.

## Cabecera de los ejercicios de código

Todos los ejercicios que leen la entrada empiezan con `ENTRADA` (`apps/api/src/database/seeds/typescript/common.ts`):

```ts
/// <reference lib="es2020" />
declare const require: any;
const lineas: string[] = require('fs').readFileSync(0, 'utf8').trim().split('\n');
```

La primera línea trae las librerías modernas; la segunda declara `require`. El generador de ejercicios con IA recibe la misma convención (`code-exercise.prompt.ts`).

## Escribir y comprobar ejercicios

1. Añade la lección en `apps/api/src/database/seeds/typescript/` y su concepto (mismo nombre que la lección) en `concepts.data.ts`.
2. Cada ejercicio de código lleva `solution` y casos de prueba; el `starterCode` **no** debe pasarlos ya.
3. Comprueba con `npm run verify:seeds` (estructura) y `npm run verify:piston` (ejecuta las soluciones en Piston). Para una sola lección: `node scripts/verify-seeds-piston.js .verify-dist typescript "Genéricos"`.
4. `npm run seed` carga los cambios en la base de datos.
