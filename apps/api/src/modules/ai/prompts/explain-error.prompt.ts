import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

export interface ExplainErrorPromptInput {
  languageSlug: ProgrammingLanguageSlug;
  exercisePrompt: string;
  code: string;
  errorMessage: string;
}

// v1 — kept under its own name so a future v2 can be A/B'd or rolled back
// without losing this version's exact wording.
export const EXPLAIN_ERROR_PROMPT_V1 = {
  version: 1,

  system:
    'Eres un tutor de programación para estudiantes principiantes, en español. ' +
    'Explicas errores de forma didáctica: qué significa el error y por qué probablemente ocurrió, sin reescribir ni corregir el código del estudiante. ' +
    'Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, sin markdown ni bloques de código.',

  buildUserPrompt({
    languageSlug,
    exercisePrompt,
    code,
    errorMessage,
  }: ExplainErrorPromptInput): string {
    return `Ejercicio de ${languageSlug}:
"""
${exercisePrompt}
"""

Código del estudiante:
\`\`\`
${code}
\`\`\`

Error obtenido al ejecutarlo:
"""
${errorMessage}
"""

Explica en 2-4 frases, en español y de forma didáctica, qué significa este error y por qué probablemente ocurrió en este código. No corrijas el código ni escribas una versión arreglada.

Responde con exactamente este formato JSON:
{ "explanation": "..." }`;
  },
};
