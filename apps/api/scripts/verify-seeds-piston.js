// Runs every reference solution of the seeded curriculum through the real
// Piston sandbox — the one the app grades with — instead of local
// interpreters. This is the only check that covers TypeScript, which compiles
// with tsc inside Piston.
// Run with: npm run verify:piston   (needs Piston up, see setup:piston)
'use strict';

const { resolve } = require('path');

const dist = resolve(__dirname, '..', process.argv[2] ?? 'dist');
const { curriculum } = require(resolve(dist, 'database/seeds/curriculum.data'));

const PISTON = process.env.PISTON_API_URL ?? 'http://localhost:2000';
const RUNTIMES = {
  python: { language: 'python', version: '3.12.0', file: 'main.py' },
  javascript: { language: 'javascript', version: '20.11.1', file: 'main.js' },
  typescript: { language: 'typescript', version: '5.0.3', file: 'main.ts' },
};
// tsc is slow to start, so TypeScript runs fewer jobs at a time.
const CONCURRENCY = { python: 4, javascript: 4, typescript: 2 };
const only = process.argv[3];
// Optional 4th argument: a regex the "language / lesson" label must match, to
// re-check just the lessons being written.
const labelFilter = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
const normalize = (text) => text.replace(/\r\n/g, '\n').trim();

function collectJobs() {
  const jobs = [];
  for (const language of curriculum) {
    if (!RUNTIMES[language.slug] || (only && only !== language.slug)) continue;
    for (const module_ of language.modules) {
      for (const lesson of module_.lessons) {
        (lesson.exercises ?? []).forEach((exercise, index) => {
          if (exercise.type !== 'code' || !exercise.solution) return;
          if (labelFilter && !labelFilter.test(`${language.slug} / ${lesson.title}`)) return;
          for (const testCase of exercise.testCases ?? []) {
            jobs.push({
              slug: language.slug,
              where: `${language.slug} / ${lesson.title} #${index}`,
              code: exercise.solution,
              testCase,
            });
          }
        });
      }
    }
  }
  return jobs;
}

async function runJob(job) {
  const runtime = RUNTIMES[job.slug];
  const response = await fetch(`${PISTON}/api/v2/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [{ name: runtime.file, content: job.code }],
      stdin: job.testCase.input,
      run_timeout: 3000,
    }),
  });
  const body = await response.json();
  if (!response.ok) return `piston ${response.status}: ${JSON.stringify(body).slice(0, 120)}`;
  if (body.run.code !== 0) {
    const detail = (body.run.stderr || body.run.stdout || body.run.message || '').trim().split('\n')[0];
    return `exit ${body.run.code}: ${detail}`;
  }
  const got = normalize(body.run.stdout);
  return got === normalize(job.testCase.expectedOutput)
    ? null
    : `input "${job.testCase.input}" gave "${got}", expected "${job.testCase.expectedOutput}"`;
}

async function runGroup(slug, jobs) {
  let failures = 0;
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      // One retry: a cold Piston sandbox sometimes times out on first use.
      let problem = await runJob(job).catch((error) => `request failed: ${error.message}`);
      if (problem) problem = await runJob(job).catch((error) => `request failed: ${error.message}`);
      if (problem) {
        failures += 1;
        console.log(`FAIL ${job.where}: ${problem}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY[slug] }, worker));
  return failures;
}

(async () => {
  const jobs = collectJobs();
  const started = Date.now();
  let failures = 0;
  for (const slug of Object.keys(RUNTIMES)) {
    const group = jobs.filter((job) => job.slug === slug);
    if (group.length > 0) failures += await runGroup(slug, group);
  }
  console.log(`${jobs.length} runs through Piston in ${Math.round((Date.now() - started) / 1000)}s, ${failures} failures`);
  process.exit(failures === 0 ? 0 : 1);
})();
