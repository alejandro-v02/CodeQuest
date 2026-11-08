import type { QuizPayload } from '../../exercises/entities/exercise.entity';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

export interface QuizTemplateResult {
  prompt: string;
  payload: QuizPayload;
  difficulty: number;
}

export type QuizTemplate = (
  languageSlug: ProgrammingLanguageSlug,
) => QuizTemplateResult;

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffleWithCorrectIndex(
  options: string[],
  correctValue: string,
): { options: string[]; correctIndex: number } {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { options: shuffled, correctIndex: shuffled.indexOf(correctValue) };
}

// "¿Cuál es el valor de x?" after a short arithmetic assignment. The correct
// answer is computed in JS with the exact same arithmetic used to build the
// snippet, so it's correct by construction — no AI call, no Piston run,
// genuinely free and instant (PLAN.md's "plantillas parametrizadas").
const variableArithmetic: QuizTemplate = (languageSlug) => {
  const a = randomInt(1, 20);
  const b = randomInt(1, 10);
  const op = (['+', '-', '*'] as const)[randomInt(0, 2)];
  const result = op === '+' ? a + b : op === '-' ? a - b : a * b;

  const code =
    languageSlug === 'python'
      ? `x = ${a}\nx = x ${op} ${b}`
      : languageSlug === 'cpp'
        ? `int x = ${a};\nx = x ${op} ${b};`
        : `let x = ${a};\nx = x ${op} ${b};`;

  const wrongAnswers = new Set<number>();
  while (wrongAnswers.size < 3) {
    const candidate = result + randomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    if (candidate !== result) {
      wrongAnswers.add(candidate);
    }
  }

  const { options, correctIndex } = shuffleWithCorrectIndex(
    [result, ...wrongAnswers].map(String),
    String(result),
  );

  return {
    prompt: '¿Cuál es el valor de `x` después de ejecutar este código?',
    payload: { code, options, correctIndex },
    difficulty: 1,
  };
};

export const QUIZ_TEMPLATES: Record<string, QuizTemplate> = {
  'variable-arithmetic': variableArithmetic,
};
