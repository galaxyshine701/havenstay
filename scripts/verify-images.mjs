// Checks that every Unsplash image URL used in this project really loads (HTTP 200).
// Run it with: npm run verify-images
// CLAUDE.md section 6: remove or replace any URL that fails BEFORE seeding.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['supabase', 'src'];
const URL_PATTERN = /https:\/\/images\.unsplash\.com\/[^\s'"`)]+/g;

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

const urls = new Map(); // url -> files that use it
for (const root of ROOTS) {
  for (const file of listFiles(root)) {
    if (!/\.(sql|js|jsx)$/.test(file)) continue;
    for (const url of readFileSync(file, 'utf8').match(URL_PATTERN) ?? []) {
      urls.set(url, [...(urls.get(url) ?? []), file]);
    }
  }
}

console.log(`Checking ${urls.size} unique image URLs...\n`);

let failed = 0;
for (const [url, files] of urls) {
  try {
    const response = await fetch(url, { method: 'GET' });
    const type = response.headers.get('content-type') ?? '';
    if (response.ok && type.startsWith('image/')) {
      console.log(`OK   ${response.status}  ${url.slice(0, 80)}`);
    } else {
      failed += 1;
      console.log(`FAIL ${response.status} (${type})  ${url}\n     used in: ${[...new Set(files)].join(', ')}`);
    }
    await response.body?.cancel();
  } catch (error) {
    failed += 1;
    console.log(`FAIL network error (${error.message})  ${url}`);
  }
}

console.log(failed === 0 ? '\nAll image URLs load.' : `\n${failed} URL(s) failed. Replace them before seeding.`);
process.exit(failed === 0 ? 0 : 1);
