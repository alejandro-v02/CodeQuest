// Starter lines shared by TypeScript exercises that read stdin: every test
// case's input arrives one value per line, in order.
//
// Piston compiles with plain tsc (target ES5, default libs, no Node typings),
// so the first lines prepare the environment:
//  - the lib reference brings in Map, Set, Promise, includes(), padStart()...
//    (iterating a Map/Set with for...of or spread still needs
//    Array.from(...) because the target is ES5);
//  - `require` has to be declared before it can be used.
export const ENTRADA =
  "/// <reference lib=\"es2020\" />\ndeclare const require: any;\nconst lineas: string[] = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\n";
