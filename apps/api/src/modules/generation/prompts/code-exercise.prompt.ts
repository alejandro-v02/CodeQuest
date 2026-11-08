import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

// Each exercise's test cases are graded by feeding `input` as stdin to the
// submitted program and comparing trimmed stdout to `expectedOutput` (see
// ExercisesService.runAgainst) — the AI has to follow the same stdin/stdout
// convention the hand-authored curriculum already uses per language.
const IO_CONVENTION: Record<ProgrammingLanguageSlug, string> = {
  python: 'Lee la entrada con `input()` e imprime la salida con `print()`.',
  javascript:
    "Lee la entrada con require('fs').readFileSync(0, 'utf8').trim() e imprime la salida con console.log().",
  typescript:
    "Lee la entrada con require('fs').readFileSync(0, 'utf8').trim() e imprime la salida con console.log().",
  cpp: 'Lee la entrada con std::cin e imprime la salida con std::cout.',
};

const LANGUAGE_NAME: Record<ProgrammingLanguageSlug, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  cpp: 'C++',
};

export interface CodeExercisePromptInput {
  languageSlug: ProgrammingLanguageSlug;
  conceptName: string;
  difficulty: number;
}

// v1 — kept under its own name (not edited in place) so a future v2 can be
// A/B'd or rolled back without losing this version's exact wording.
export const CODE_EXERCISE_PROMPT_V1 = {
  version: 1,

  system:
    'Eres un generador de ejercicios de programación para principiantes, para una app de aprendizaje en español. ' +
    'Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, sin markdown ni bloques de código.',

  buildUserPrompt({
    languageSlug,
    conceptName,
    difficulty,
  }: CodeExercisePromptInput): string {
    const languageName = LANGUAGE_NAME[languageSlug];
    const ioConvention = IO_CONVENTION[languageSlug];

    return `Genera UN ejercicio de código corto en ${languageName} sobre el concepto "${conceptName}", para un estudiante principiante. Dificultad ${difficulty} de 5 (1 = muy fácil, 5 = requiere combinar varias ideas).

Reglas:
- El ejercicio se resuelve leyendo un valor de la entrada estándar y escribiendo un resultado en la salida estándar. ${ioConvention}
- "starterCode" es el código que ve el estudiante: debe leer la entrada y dejar un comentario o un TODO de dónde escribir la lógica, pero NO debe resolver el ejercicio ni producir la salida esperada.
- "referenceSolution" es una solución completa y correcta que si se ejecuta, SÍ produce exactamente la salida esperada en todos los "testCases".
- Genera entre 3 y 5 "testCases" con entradas distintas entre sí. Al menos uno debe tener "isHidden": true (caso de verificación, no se muestra al estudiante) y al menos uno "isHidden": false.
- El enunciado ("prompt") debe ser claro, en español, y decir explícitamente cómo se lee la entrada y qué se debe imprimir.
- No agregues explicaciones fuera del JSON.

Responde con exactamente este formato JSON:
{
  "prompt": "...",
  "starterCode": "...",
  "referenceSolution": "...",
  "testCases": [
    { "input": "...", "expectedOutput": "...", "isHidden": false }
  ]
}`;
  },
};
