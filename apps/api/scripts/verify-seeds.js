// Sanity-checks the curriculum seed without touching the database:
// payload shapes for quiz/fill/sort/bug, and — for Python 'code' exercises
// that carry a `solution` (Python and JavaScript) — runs it against every test case.
// Run with: npm run verify:seeds
'use strict';

const { spawnSync } = require('child_process');
const { resolve } = require('path');

// Compiled output to read (npm run verify:seeds builds it into .verify-dist so
// the running dev server's dist/ is never touched).
const dist = resolve(__dirname, '..', process.argv[2] ?? 'dist');
const { curriculum } = require(resolve(dist, 'database/seeds/curriculum.data'));
const { conceptsByLanguage } = require(resolve(dist, 'database/seeds/concepts.data'));

const normalize = (text) => text.replace(/\r\n/g, '\n').trim();
let errors = 0;
let exercises = 0;
let lessons = 0;
let solutionsRun = 0;

function fail(where, message) {
  errors += 1;
  console.error(`FAIL ${where}: ${message}`);
}

for (const language of curriculum) {
  for (const module_ of language.modules) {
    for (const lesson of module_.lessons) {
      lessons += 1;
      if ((lesson.exercises ?? []).length > 0 && !(conceptsByLanguage[language.slug] ?? []).some((concept) => concept.name === lesson.title)) {
        fail(`${language.slug} / ${lesson.title}`, 'has exercises but no concept with the same name in concepts.data.ts');
      }
      (lesson.exercises ?? []).forEach((exercise, index) => {
        exercises += 1;
        const where = `${language.slug} / ${lesson.title} #${index}`;
        const payload = exercise.payload;

        if (exercise.type === 'quiz') {
          if (!payload || payload.options.length < 2) fail(where, 'quiz needs 2+ options');
          else if (payload.correctIndex < 0 || payload.correctIndex >= payload.options.length) fail(where, 'correctIndex out of range');
        } else if (exercise.type === 'fill') {
          const placeholders = (payload.template.match(/\{\{\d+\}\}/g) ?? []).length;
          if (placeholders === 0 || placeholders !== payload.blanks.length) fail(where, `fill has ${placeholders} placeholders but ${payload.blanks.length} blanks`);
        } else if (exercise.type === 'sort') {
          if (!payload || payload.blocks.length < 2) fail(where, 'sort needs 2+ blocks');
        } else if (exercise.type === 'bug') {
          if (payload.buggyLineIndex < 0 || payload.buggyLineIndex >= payload.lines.length) fail(where, 'buggyLineIndex out of range');
          else if (payload.lines[payload.buggyLineIndex].trim() === '') fail(where, 'buggy line is blank');
          if (!payload.explanation) fail(where, 'bug needs an explanation');
        } else if (exercise.type === 'code') {
          if (!exercise.testCases || exercise.testCases.length < 2) fail(where, 'code needs 2+ test cases');
          const runner = { python: ['python', '-c'], javascript: ['node', '-e'] }[language.slug];
          if (runner && exercise.solution) {
            for (const testCase of exercise.testCases ?? []) {
              solutionsRun += 1;
              const run = spawnSync(runner[0], [runner[1], exercise.solution], {
                input: testCase.input + '\n',
                encoding: 'utf8',
                timeout: 5000,
                env: { ...process.env, PYTHONUTF8: '1' },
              });
              if (run.status !== 0) fail(where, `solution crashed on "${testCase.input}": ${run.stderr.trim().split('\n').pop()}`);
              else if (normalize(run.stdout) !== normalize(testCase.expectedOutput)) fail(where, `input "${testCase.input}" gave "${normalize(run.stdout)}", expected "${testCase.expectedOutput}"`);
            }
          } else if (runner) {
            console.warn(`WARN ${where}: ${language.slug} code exercise has no solution to verify`);
          }
        }
      });
    }
  }
}

console.log(`${lessons} lessons, ${exercises} exercises, ${solutionsRun} solution runs, ${errors} errors`);
process.exit(errors === 0 ? 0 : 1);
