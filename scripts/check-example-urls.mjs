/**
 * Dev check: fetch every example URL of documentation.md against the live
 * reference instance and report the outcome. Expected: HTTP 200 with
 * `code: 0`, plus a small number of documented `code: -1` answers for
 * parameters whose fixtures do not exist (e.g. the `alice/example` post).
 * 404s, HTML and anything else fail the check.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const md = readFileSync(path.join(root, 'documentation.md'), 'utf8');
const urls = [...md.matchAll(/- Example request: `([^`]+)`/g)].map((match) => match[1]);

let ok = 0;
const appErrors = [];
const failures = [];

for (const url of urls) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* html or other non-json */
    }
    if (response.status === 200 && json?.code === 0) ok += 1;
    else if (response.status === 200 && json?.code === -1) appErrors.push(`${json.error} <= ${url}`);
    else failures.push(`${response.status} ${text.slice(0, 90).replace(/\s+/g, ' ')} <= ${url}`);
  } catch (error) {
    failures.push(`ERR ${error.message} <= ${url}`);
  }
}

console.log(`example urls: ${urls.length}`);
console.log(`code 0: ${ok} | code -1 (app error): ${appErrors.length} | failures: ${failures.length}`);
appErrors.slice(0, 20).forEach((entry) => console.log(`  -1: ${entry}`));
failures.slice(0, 20).forEach((entry) => console.log(`  FAIL: ${entry}`));

process.exit(failures.length === 0 ? 0 : 1);
