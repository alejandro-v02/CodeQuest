// Starter lines shared by TypeScript exercises that read stdin: every test
// case's input arrives one value per line, in order. Piston compiles with
// plain tsc and ships no Node typings, so `require` must be declared first.
export const ENTRADA =
  "declare const require: any;\nconst lineas: string[] = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\n";
