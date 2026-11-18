import { CODE_EXERCISE_PROMPT_V1 } from './code-exercise.prompt';

describe('CODE_EXERCISE_PROMPT_V1', () => {
  const build = (
    languageSlug: 'python' | 'javascript' | 'typescript' | 'cpp',
  ) =>
    CODE_EXERCISE_PROMPT_V1.buildUserPrompt({
      languageSlug,
      conceptName: 'Bucles',
      difficulty: 3,
    });

  it('names the concept, the language and the difficulty', () => {
    const prompt = build('python');

    expect(prompt).toContain('Python');
    expect(prompt).toContain('"Bucles"');
    expect(prompt).toContain('Dificultad 3 de 5');
  });

  it('gives each language its own way of reading the input', () => {
    expect(build('python')).toContain('input()');
    expect(build('javascript')).toContain("readFileSync(0, 'utf8')");
    expect(build('cpp')).toContain('std::cin');
  });

  it('tells TypeScript exercises how to compile in the sandbox', () => {
    const prompt = build('typescript');

    expect(prompt).toContain('declare const require: any;');
    expect(prompt).toContain('reference lib="es2020"');
    expect(prompt).toContain('Array.from');
  });

  it('asks for a JSON-only answer with the fields the generator validates', () => {
    const prompt = build('cpp');

    for (const field of [
      'prompt',
      'starterCode',
      'referenceSolution',
      'testCases',
    ]) {
      expect(prompt).toContain(`"${field}"`);
    }
    expect(CODE_EXERCISE_PROMPT_V1.system).toContain('JSON');
  });
});
