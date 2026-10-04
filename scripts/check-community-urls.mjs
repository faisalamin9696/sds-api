/**
 * Dev check: every example URL of a method that takes a `community`
 * parameter must use a hive community id (`hive-…`) and must answer with
 * `code: 0` on the live reference instance — SDS accepts non-hive values
 * but silently returns empty data.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const md = readFileSync(path.join(root, 'documentation.md'), 'utf8');

// Split the API reference into its `#### <index> <ns.method>` entries.
const blocks = md.split(/^#### /m).slice(1);

const communityMethods = [];
for (const block of blocks) {
  const heading = block.split('\n', 1)[0];
  const hasCommunityParam = /^\|\s*\d+\s*\|\s*`community`\s*\|/m.test(block);
  if (!hasCommunityParam) continue;
  const url = /- Example request: `([^`]+)`/.exec(block)?.[1];
  communityMethods.push({ heading, url });
}

const missingUrl = communityMethods.filter((entry) => !entry.url);
const nonHive = communityMethods.filter((entry) => entry.url && !entry.url.includes('/hive-'));

console.log(`methods with a community param: ${communityMethods.length}`);
console.log(`missing example url: ${missingUrl.length} | not hive-160125: ${nonHive.length}`);
missingUrl.slice(0, 5).forEach((entry) => console.log(`  no url: ${entry.heading}`));
nonHive.slice(0, 5).forEach((entry) => console.log(`  not hive: ${entry.heading} => ${entry.url}`));

let ok = 0;
const bad = [];
for (const { heading, url } of communityMethods) {
  if (!url) continue;
  try {
    const response = await fetch(url);
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not json */
    }
    if (response.status === 200 && json && json.code === 0) ok += 1;
    else bad.push(`${heading} ${url} => ${response.status} ${text.slice(0, 90)}`);
  } catch (error) {
    bad.push(`${heading} ${url} ERR ${error.message}`);
  }
}
console.log(`live community example urls: ok=${ok} bad=${bad.length}`);
bad.slice(0, 10).forEach((entry) => console.log(`  ${entry}`));

process.exit(missingUrl.length === 0 && nonHive.length === 0 && bad.length === 0 ? 0 : 1);
