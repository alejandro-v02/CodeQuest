// Smoke test of one language path through the running API, as a new user:
// registers, picks the language, walks every lesson and checks that it has
// content and exercises, and that submitting a code exercise's untouched
// starter does NOT pass. Cleans up the test user afterwards.
// Run with: node scripts/smoke-language.js <python|javascript|typescript|cpp>
// (needs the API on API_URL, default http://localhost:3000, and the database
// reachable with the same .env the API uses)
'use strict';

const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../../../.env'), quiet: true });
const { Client } = require('pg');

const BASE = process.env.API_URL ?? 'http://localhost:3000';
const slug = process.argv[2];
if (!['python', 'javascript', 'typescript', 'cpp'].includes(slug)) {
  console.error('Usage: node scripts/smoke-language.js <python|javascript|typescript|cpp>');
  process.exit(2);
}

async function http(method, url, token, body) {
  const response = await fetch(BASE + url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60_000),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: response.status, json };
}

let problems = 0;
function check(ok, message) {
  if (!ok) {
    problems += 1;
    console.log(`FAIL ${message}`);
  }
}

(async () => {
  const db = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'codequest',
    password: process.env.DB_PASSWORD || 'codequest',
    database: process.env.DB_NAME || 'codequest',
  });
  await db.connect();
  let userId = null;
  try {
    const reg = await http('POST', '/auth/register', null, {
      email: `smoke.${slug}.${Date.now()}@example.com`,
      password: 'smoke-1234',
      displayName: 'Smoke',
    });
    userId = reg.json.user.id;
    const token = reg.json.accessToken;
    check((await http('PATCH', '/users/me/onboarding', token, { preferredLanguage: slug, dailyGoalMinutes: 15 })).status === 200, 'onboarding');

    const path = await http('GET', `/courses/${slug}/path`, token);
    check(path.status === 200, `path status ${path.status}`);
    const lessons = path.json.modules.flatMap((module_) => module_.lessons);
    console.log(`${slug}: ${path.json.modules.length} modules, ${lessons.length} lessons`);

    let exercises = 0;
    let starterChecked = false;
    for (const lessonRef of lessons) {
      // Later lessons are locked for a new user, so read them straight from the database.
      const row = await db.query('select title, "contentMarkdown" as content from lessons where id = $1', [lessonRef.id]);
      check(Boolean(row.rows[0].content), `lesson without content: ${row.rows[0].title}`);
      const count = await db.query('select count(*)::int as n from exercises where lesson_id = $1 and status = \'approved\'', [lessonRef.id]);
      exercises += count.rows[0].n;
      check(count.rows[0].n > 0, `lesson without exercises: ${row.rows[0].title}`);
    }
    console.log(`${slug}: ${exercises} lesson exercises`);

    // The first lesson is open: submit an untouched starter and expect a failure.
    const list = await http('GET', `/exercises/lesson/${lessons[0].id}`, token);
    const code = (list.json ?? []).find((exercise) => exercise.type === 'code');
    if (code) {
      const detail = await http('GET', `/exercises/${code.id}`, token);
      const result = await http('POST', `/exercises/${code.id}/submit`, token, { code: detail.json.starterCode ?? '' });
      check(result.status === 200 && result.json.allPassed === false, 'untouched starter must not pass');
      starterChecked = true;
    }
    check(starterChecked, 'no code exercise found in the first lesson');
  } finally {
    if (userId) {
      for (const table of ['attempts', 'user_exercise_history', 'user_progress', 'xp_events', 'streaks', 'user_achievements', 'analytics_events']) {
        await db.query(`delete from ${table} where user_id = $1`, [userId]).catch(() => undefined);
      }
      await db.query('delete from users where id = $1', [userId]).catch(() => undefined);
    }
    await db.end();
  }
  console.log(problems === 0 ? `${slug}: smoke test passed` : `${slug}: ${problems} problem(s)`);
  process.exit(problems === 0 ? 0 : 1);
})().catch((error) => {
  console.error('FAILED', error.message);
  process.exit(1);
});
