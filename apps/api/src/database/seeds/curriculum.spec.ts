import { conceptsByLanguage } from './concepts.data';
import { curriculum } from './curriculum.data';

// Structural checks on the hand-written curriculum, so a typo in a seed fails
// in `npm test` instead of surfacing as a broken exercise in the app. The
// solutions themselves are run by `npm run verify:seeds` / `verify:piston`.
describe('curriculum seed', () => {
  it('has unique lesson titles within each language', () => {
    for (const language of curriculum) {
      const titles = language.modules.flatMap((module_) =>
        module_.lessons.map((lesson) => lesson.title),
      );
      expect({
        language: language.slug,
        duplicates: duplicatesOf(titles),
      }).toEqual({ language: language.slug, duplicates: [] });
    }
  });

  it('has unique concept slugs and names within each language', () => {
    for (const [slug, concepts] of Object.entries(conceptsByLanguage)) {
      expect({
        slug,
        slugs: duplicatesOf(concepts.map((concept) => concept.slug)),
        names: duplicatesOf(concepts.map((concept) => concept.name)),
      }).toEqual({ slug, slugs: [], names: [] });
    }
  });

  it('gives every lesson with exercises a concept of the same name', () => {
    const missing: string[] = [];
    for (const language of curriculum) {
      const names = new Set(
        (conceptsByLanguage[language.slug] ?? []).map((c) => c.name),
      );
      for (const module_ of language.modules) {
        for (const lesson of module_.lessons) {
          if ((lesson.exercises ?? []).length > 0 && !names.has(lesson.title)) {
            missing.push(`${language.slug} / ${lesson.title}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('has well-formed exercises', () => {
    const problems: string[] = [];
    for (const language of curriculum) {
      for (const module_ of language.modules) {
        for (const lesson of module_.lessons) {
          (lesson.exercises ?? []).forEach((exercise, index) => {
            const where = `${language.slug} / ${lesson.title} #${index}`;
            if (exercise.difficulty < 1 || exercise.difficulty > 5) {
              problems.push(`${where}: difficulty out of range`);
            }
            if (exercise.prompt.trim() === '') {
              problems.push(`${where}: empty prompt`);
            }
            if (exercise.type === 'code') {
              const cases = exercise.testCases ?? [];
              if (cases.length < 2) {
                problems.push(`${where}: needs 2+ test cases`);
              }
              if (!cases.some((testCase) => !testCase.isHidden)) {
                problems.push(`${where}: needs a visible test case`);
              }
              if (!exercise.solution) {
                problems.push(`${where}: missing reference solution`);
              }
              // An empty string is allowed (write it from scratch); a missing
              // field is not.
              if (exercise.starterCode === undefined) {
                problems.push(`${where}: missing starter code`);
              }
            }
          });
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('has a written lesson for every Python, JavaScript and TypeScript topic', () => {
    const empty: string[] = [];
    for (const language of curriculum) {
      if (language.slug === 'cpp') {
        continue;
      }
      for (const module_ of language.modules) {
        for (const lesson of module_.lessons) {
          if (!lesson.contentMarkdown) {
            empty.push(`${language.slug} / ${lesson.title}`);
          }
        }
      }
    }
    expect(empty).toEqual([]);
  });
});

function duplicatesOf(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}
