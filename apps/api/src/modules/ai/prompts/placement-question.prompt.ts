import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

export interface PlacementQuestionPromptInput {
  languageSlug: ProgrammingLanguageSlug;
}

const LANGUAGE_NAME: Record<ProgrammingLanguageSlug, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  cpp: 'C++',
};

// v1 — kept under its own name so a future v2 can be A/B'd or rolled back
// without losing this version's exact wording. Generated once per language
// and cached (PlacementQuiz) — every user who takes the test for that
// language reuses the same questions, so scoring stays local/deterministic.
export const PLACEMENT_QUESTION_PROMPT_V1 = {
  version: 1,

  system:
    'Eres un generador de pruebas de nivel para una app de aprendizaje de programación en español. ' +
    'Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, sin markdown ni bloques de código.',

  buildUserPrompt({ languageSlug }: PlacementQuestionPromptInput): string {
    const languageName = LANGUAGE_NAME[languageSlug];
    return `Genera 4 preguntas de opción múltiple en español para medir el nivel de alguien que empieza a aprender ${languageName}, de dificultad creciente (la primera muy básica, la última ya requiere combinar un par de ideas). Cada pregunta tiene exactamente 4 opciones y solo una correcta.

Responde con exactamente este formato JSON:
{
  "questions": [
    { "prompt": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0 }
  ]
}`;
  },
};
