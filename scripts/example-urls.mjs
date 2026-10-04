/** Dev helper: snapshot every example URL in documentation.md (arg: output file). */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const md = readFileSync(path.join(root, 'documentation.md'), 'utf8');
const urls = [...md.matchAll(/- Example request: `([^`]+)`/g)].map((match) => match[1]);
const out = path.join(root, 'scripts', process.argv[2] ?? '.example-urls.txt');
writeFileSync(out, urls.join('\n') + '\n');
console.log(`snapshot: ${urls.length} urls -> ${out}`);
