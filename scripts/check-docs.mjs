/** Dev check: verifies documentation.md anchors, fences and index integrity. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const md = readFileSync(path.join(root, 'documentation.md'), 'utf8');
const lines = md.split(/\r?\n/);

const slug = (heading) =>
  heading
    .replace(/^#+\s*/, '')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .replace(/ /g, '-'); // GitHub does not collapse repeated spaces

const headingSlugs = new Set();
for (const line of lines) if (/^#{1,6}\s/.test(line)) headingSlugs.add(slug(line));

const links = [...md.matchAll(/\]\(#([^)]+)\)/g)].map((match) => match[1]);
const missing = [...new Set(links.filter((link) => !headingSlugs.has(link)))];
console.log(`headings: ${headingSlugs.size} | links: ${links.length} | unique: ${new Set(links).size}`);
console.log(`broken anchors: ${missing.length}`);
missing.slice(0, 20).forEach((link) => console.log(`  missing: ${link}`));

const fences = lines.filter((line) => line.startsWith('```')).length;
console.log(`code fences: ${fences} ${fences % 2 === 0 ? '(balanced)' : '(UNBALANCED!)'}`);

// Index completeness: every method heading must be linked from the index and
// every method heading must carry a global index number.
const methodHeadings = lines.filter((line) => /^#### \d/.test(line));
const linkedIndexes = new Set([...md.matchAll(/- \[[\d.]+ `[^`]+`\]\(#([^)]+)\)/g)].map((m) => m[1]));
const unlinked = methodHeadings.filter((line) => !linkedIndexes.has(slug(line)));
console.log(`method headings: ${methodHeadings.length} | index entries: ${linkedIndexes.size}`);
console.log(`headings missing from index: ${unlinked.length}`);
unlinked.slice(0, 10).forEach((line) => console.log(`  unlinked: ${line.slice(0, 70)}`));

// Global index numbering must be contiguous 1..N.
const globalNumbers = [...md.matchAll(/Global index: \*\*#(\d+)\*\*/g)].map((m) => Number(m[1]));
const contiguous = globalNumbers.every((n, i) => n === i + 1);
console.log(`global index entries: ${globalNumbers.length} | contiguous 1..N: ${contiguous}`);

const exampleUrls = [...md.matchAll(/- Example request: `([^`]+)`/g)];
console.log(`example urls: ${exampleUrls.length}`);

process.exit(
  missing.length === 0 && fences % 2 === 0 && unlinked.length === 0 && contiguous ? 0 : 1,
);
