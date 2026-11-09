import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

export interface HintPromptInput {
  languageSlug: ProgrammingLanguageSlug;
  exercisePrompt: string;
  difficulty: number;
  level: 1 | 2 | 3;
}

const LEVEL_INSTRUCTION: Record<1 | 2 | 3, string> = {
  1: 'Da una pista MUY general: qué idea o concepto del lenguaje aplica aquí, sin mencionar sintaxis concreta.',
  2: 'Da una pista más concreta: qué pasos seguir o qué estructura usar, sin escribir código del ejercicio.',
  3: 'Da la pista más específica posible (puedes incluir un fragmento muy corto de código de ejemplo, de una situación distinta a la del ejercicio) pero SIN resolver el ejercicio ni dar la solución completa.',
};

// v1 — kept under its own name so a future v2 can be A/B'd or rolled back
// without losing this version's exact wording.
export const HINT_PROMPT_V1 = {
  version: 1,

  system:
    'Eres un tutor de programación paciente para estudiantes principiantes, en español. ' +
    'Das pistas progresivas sin revelar nunca la solución completa del ejercicio. ' +
    'Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, sin markdown ni bloques de código.',

  buildUserPrompt({
    languageSlug,
    exercisePrompt,
    difficulty,
    level,
  }: HintPromptInput): string {
    return `Ejercicio de ${languageSlug} (dificultad ${difficulty} de 5):
"""
${exercisePrompt}
"""

Da la pista de nivel ${level} de 3 para este ejercicio. ${LEVEL_INSTRUCTION[level]}
No reveles la solución completa ni escribas el código que resuelve el ejercicio entero.

Responde con exactamente este formato JSON:
{ "text": "..." }`;
  },
};
