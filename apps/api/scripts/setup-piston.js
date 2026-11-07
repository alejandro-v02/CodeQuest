// One-time setup: installs the language runtimes CodeQuest needs on a
// freshly started Piston container (ships with zero runtimes installed).
// Plain Node script — no NestJS/TypeORM needed, so it runs directly with
// `node scripts/setup-piston.js`, no build step.
'use strict';

const { config } = require('dotenv');
const { resolve } = require('path');

config({ path: resolve(__dirname, '../../../.env') });

const PISTON_API_URL = process.env.PISTON_API_URL ?? 'http://localhost:2000';
// These are Piston's install-time package names, which aren't always the
// same as the execute-time language names/aliases used in piston.service.ts
// (e.g. the "node" package is executed as "javascript"; "gcc" as "c++").
const LANGUAGES = ['python', 'node', 'typescript', 'gcc'];

// Picks the highest semver-ish version so e.g. python doesn't resolve to an
// old 2.x release just because it happens to sort first in the API response.
function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  const length = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

async function main() {
  console.log(`Using Piston at ${PISTON_API_URL}`);

  let packages;
  try {
    const response = await fetch(`${PISTON_API_URL}/api/v2/packages`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    packages = await response.json();
  } catch (error) {
    console.error(
      `Could not reach Piston. Is "docker compose up -d piston" running?\n${error}`,
    );
    process.exit(1);
  }

  for (const language of LANGUAGES) {
    const candidates = packages.filter((pkg) => pkg.language === language);
    if (candidates.length === 0) {
      console.warn(`No package named "${language}" is available in Piston.`);
      continue;
    }

    // The latest version, not just any installed one — older versions of the
    // same language can linger installed alongside it (e.g. python 2.7.18
    // next to 3.12.0) and shouldn't be mistaken for "we're all set".
    const target = [...candidates].sort((a, b) =>
      compareVersions(b.language_version, a.language_version),
    )[0];

    if (target.installed) {
      console.log(`${language} ${target.language_version} already installed.`);
      continue;
    }
    console.log(`Installing ${language} ${target.language_version}...`);
    const response = await fetch(`${PISTON_API_URL}/api/v2/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, version: target.language_version }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Failed to install ${language}: HTTP ${response.status} ${text}`);
      continue;
    }
    console.log(`Installed ${language} ${target.language_version}.`);
  }

  console.log('Piston setup complete.');
}

main();
