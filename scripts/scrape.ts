/**
 * Scrapes the SDS API Reference and writes `data/api.json`.
 *
 * Usage:
 *   npm run scrape
 *   npm run scrape -- --only=chain_api,posts_api
 *   npm run scrape -- --out=/tmp/api.json
 *   SDS_SCRAPE_URL=https://sds1.steemworld.org npm run scrape
 */
import { parse, type HTMLElement } from 'node-html-parser';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  SDSApiReference,
  SDSFieldMeta,
  SDSMethodMeta,
  SDSModuleMeta,
  SDSParamMeta,
} from '../src/meta-types';

const BASE_URL = (process.env.SDS_SCRAPE_URL ?? 'https://sds0.steemworld.org').replace(/\/+$/, '');
const CONCURRENCY = Number(process.env.SDS_SCRAPE_CONCURRENCY ?? 6);

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) ?? '').replace('--only=', '');
const outFile = (args.find((a) => a.startsWith('--out=')) ?? '').replace('--out=', '');
const onlyModules = only
  ? new Set(only.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean))
  : null;

const OUT_PATH = outFile || fileURLToPath(new URL('../data/api.json', import.meta.url));

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchText(url: string, attempts = 3): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': '@steempro/sds-api scraper', accept: 'text/html' },
      });
      if (response.status === 404) {
        throw Object.assign(new Error(`404 for ${url}`), { fatal: true });
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if ((error as { fatal?: boolean }).fatal) throw error;
      if (attempt < attempts - 1) await sleep(400 * 2 ** attempt);
    }
  }
  throw lastError;
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

const textOf = (el?: HTMLElement | null): string =>
  el
    ? el.text
        .replace(/<\/?(?:code|pre|a|strong|em)>/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

function allowedValuesOf(td?: HTMLElement | null): string[] | undefined {
  if (!td) return undefined;
  // `node-html-parser` keeps the content of `<pre>` as raw text, so the inner
  // `<code>` markup has to be stripped manually.
  const pre = td.querySelector('pre');
  const raw = pre ? pre.text : td.text;
  if (!pre && !raw.includes('<code>')) return undefined;
  const values = raw
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => line.trim().replace(/^-\s*/, '').trim())
    .filter((line) => line && line !== 'See details');
  return values.length ? values : undefined;
}

const toNumber = (value: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/* ------------------------------------------------------------------ */
/* page parsers                                                        */
/* ------------------------------------------------------------------ */

interface DiscoveredModule {
  id: string;
  group: string;
}

function parseHomePage(html: string): { version: string; modules: DiscoveredModule[] } {
  const root = parse(html);
  const version = textOf(root.querySelector('#versionInfo'));
  const modules: DiscoveredModule[] = [];
  let group = '';

  for (const child of root.querySelector('body')?.childNodes ?? []) {
    const el = child as HTMLElement;
    const tag = el.tagName?.toLowerCase();
    if (tag === 'h2') {
      if (el.getAttribute('class')?.includes('headerGroup')) group = textOf(el);
    } else if (tag === 'h3' && group) {
      const link = el.querySelector('a');
      const id = link?.getAttribute('href')?.replace(/^\//, '');
      if (id && id.endsWith('_api')) modules.push({ id, group });
    }
  }
  return { version, modules };
}

interface DiscoveredMethod {
  name: string;
  /** Route segments after the method name, whitespace-normalized (ranges use `-`). */
  routeSegments: string[];
  /** Parameter names in route order (a range segment contributes two). */
  routeParams: { name: string; optional: boolean }[];
  section?: string;
}

/** `:fromBlockNum - :toBlockNum` -> `:fromBlockNum-:toBlockNum` (the real route). */
const normalizeRouteSegment = (segment: string): string => segment.replace(/\s+/g, '');

function extractRouteParams(segment: string): { name: string; optional: boolean }[] {
  const params: { name: string; optional: boolean }[] = [];
  const pattern = /:([A-Za-z_][A-Za-z0-9_]*)(\??)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(segment))) {
    params.push({ name: match[1], optional: Boolean(match[2]) });
  }
  return params;
}

function parseModulePage(html: string, moduleId: string): DiscoveredMethod[] {
  const root = parse(html);
  const methods: DiscoveredMethod[] = [];
  let section: string | undefined;

  for (const child of root.querySelector('body')?.childNodes ?? []) {
    const el = child as HTMLElement;
    const tag = el.tagName?.toLowerCase();

    if (tag === 'h4') {
      const link = el.querySelector('a[href^="/describeMethod/"]');
      if (!link) continue;
      const parts = link.text
        .replace(/\s+/g, ' ')
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean);
      const name = textOf(link.querySelector('span.methodName')) || parts[0];
      if (!name) continue;
      const routeSegments = parts.slice(1).map(normalizeRouteSegment);
      methods.push({
        name,
        routeSegments,
        routeParams: routeSegments.flatMap(extractRouteParams),
        section,
      });
    } else if (tag === 'h3' || tag === 'h2') {
      const title = textOf(el);
      if (title && title !== moduleId && title !== 'Active Config' && title !== 'Database Info') {
        section = title;
      } else if (title === 'Active Config' || title === 'Database Info') {
        break;
      }
    }
  }
  return methods;
}

interface ParamRow {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  min?: number;
  max?: number;
  allowedValues?: string[];
}

interface FieldRow {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  allowedValues?: string[];
}

interface FieldSection {
  type: string;
  rows: FieldRow[];
}

function readTable(table: HTMLElement): Map<string, HTMLElement>[] {
  const headers = table
    .querySelectorAll('thead th')
    .map((th) => textOf(th).toLowerCase());
  return table.querySelectorAll('tbody tr').map((tr) => {
    const cells = tr.querySelectorAll('td');
    const row = new Map<string, HTMLElement>();
    cells.forEach((cell, index) => {
      const header = headers[index] ?? `col${index}`;
      row.set(header, cell);
    });
    return row;
  });
}

function parseParamTable(table: HTMLElement): SDSParamMeta[] {
  const params: SDSParamMeta[] = [];
  for (const row of readTable(table)) {
    const rawName = textOf(row.get('name'));
    if (!rawName) continue;
    const optionalByName = rawName.endsWith('?');
    const name = rawName.replace(/^:/, '').replace(/\?$/, '').trim();
    const optionalText = textOf(row.get('optional')).toLowerCase();
    const param: SDSParamMeta = {
      name,
      type: textOf(row.get('type')) || 'string',
      optional: optionalByName || optionalText === 'yes' || optionalText === 'true',
    };
    const def = textOf(row.get('default'));
    if (def) param.default = def;
    const min = toNumber(textOf(row.get('min.')) || textOf(row.get('min')));
    const max = toNumber(textOf(row.get('max.')) || textOf(row.get('max')));
    if (min !== undefined) param.min = min;
    if (max !== undefined) param.max = max;
    const allowed = allowedValuesOf(row.get('allowed values'));
    if (allowed) param.allowedValues = allowed;
    params.push(param);
  }
  return params;
}

function parseFieldTable(table: HTMLElement, paramType?: string): FieldRow[] {
  void paramType;
  const rows: FieldRow[] = [];
  for (const row of readTable(table)) {
    const rawName = textOf(row.get('name'));
    if (!rawName) continue;
    const field: FieldRow = {
      name: rawName.replace(/^\./, '').replace(/^:/, '').trim(),
      type: textOf(row.get('type')) || 'string',
      optional: textOf(row.get('optional')).toLowerCase() !== 'no',
    };
    const def = textOf(row.get('default'));
    if (def) field.default = def;
    const allowed = allowedValuesOf(row.get('allowed values'));
    if (allowed) field.allowedValues = allowed;
    rows.push(field);
  }
  return rows;
}

/**
 * Builds the (possibly nested) field documentation of a structured parameter
 * from the flat `:param` / `:param.child` sections of the reference page.
 */
function buildFields(paramName: string, sections: Map<string, FieldSection>): SDSFieldMeta[] | undefined {
  const nodes = new Map<string, SDSFieldMeta>();

  for (const [pathKey, section] of sections) {
    nodes.set(pathKey, { name: pathKey, type: section.type, optional: true, fields: [] });
  }

  for (const [pathKey, section] of sections) {
    const parentNode = nodes.get(pathKey);
    if (!parentNode) continue;
    for (const row of section.rows) {
      const childPath = `${pathKey}.${row.name}`;
      let childNode = nodes.get(childPath);
      if (!childNode) {
        childNode = {
          name: childPath,
          type: row.type,
          optional: row.optional,
          fields: [],
        };
        if (row.default !== undefined) childNode.default = row.default;
        if (row.allowedValues) childNode.allowedValues = row.allowedValues;
        nodes.set(childPath, childNode);
      } else if (childNode.type !== row.type) {
        childNode.type = row.type;
      }
      if (!parentNode.fields?.some((field) => field.name === childPath)) {
        parentNode.fields = parentNode.fields ?? [];
        parentNode.fields.push(childNode);
      }
    }
  }

  const root = nodes.get(paramName);
  if (!root) return undefined;
  return root.fields && root.fields.length ? root.fields : undefined;
}

interface MethodDetails {
  description?: string;
  example?: string;
  result?: string;
  maxLimit?: number;
  params?: SDSParamMeta[];
}

function parseMethodPage(html: string): MethodDetails {
  const root = parse(html);
  const body = root.querySelector('body');
  const result: MethodDetails = {};

  const params: SDSParamMeta[] = [];
  const fieldSections = new Map<string, FieldSection>();

  let section: string | null = null;
  let fieldSection: string | null = null;
  const description: string[] = [];

  for (const child of body?.childNodes ?? []) {
    const el = child as HTMLElement;
    const tag = el.tagName?.toLowerCase();
    if (!tag) continue;

    if (tag === 'h4') {
      const title = textOf(el);
      const isNarrow = (el.getAttribute('class') ?? '').split(/\s+/).includes('narrow');
      if (isNarrow) {
        section = title;
        fieldSection = null;
      } else {
        const match = title.match(/^:([^\s(]+)\s*\(\s*([^)]+?)\s*\)/);
        if (match) {
          fieldSection = match[1];
          fieldSections.set(fieldSection, { type: match[2], rows: [] });
        }
        section = null;
      }
    } else if (tag === 'p') {
      const content = textOf(el);
      if (section === 'Description') {
        description.push(content);
      } else if (section === 'Result' && !result.result) {
        result.result = content;
      } else if (section === 'Example' && !result.example) {
        result.example = content;
      } else if (section === 'Max. Limit' && result.maxLimit === undefined) {
        const value = toNumber(content);
        if (value !== undefined) result.maxLimit = value;
      } else if (section && section !== 'Parameters' && section !== 'Example' && content) {
        // Additional reference sections (e.g. `Ranges`) are kept as prose.
        description.push(`**${section}**: ${content}`);
      }
    } else if (tag === 'table') {
      if (section === 'Parameters') {
        params.push(...parseParamTable(el));
      } else if (fieldSection) {
        const info = fieldSections.get(fieldSection);
        if (info && info.rows.length === 0) info.rows = parseFieldTable(el);
      }
    } else if (tag === 'hr') {
      section = null;
      fieldSection = null;
    }
  }

  if (description.length) result.description = description.filter(Boolean).join('\n');
  if (params.length) result.params = params;

  // Attach documented structure to structured parameters.
  const structured = new Map<string, SDSFieldMeta[]>();
  const grouped = new Map<string, Map<string, FieldSection>>();
  for (const [sectionName, info] of fieldSections) {
    const paramName = sectionName.split('.')[0];
    if (!grouped.has(paramName)) grouped.set(paramName, new Map());
    grouped.get(paramName)!.set(sectionName, info);
  }
  for (const [paramName, sections] of grouped) {
    const fields = buildFields(paramName, sections);
    if (fields) structured.set(paramName, fields);
  }
  for (const param of params) {
    const fields = structured.get(param.name);
    if (fields) param.fields = fields;
  }

  return result;
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

function toNamespaceKey(moduleId: string): string {
  const base = moduleId.replace(/_api$/, '');
  return base.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

async function main(): Promise<void> {
  console.log(`Scraping SDS API reference from ${BASE_URL} ...`);

  const homeHtml = await fetchText(`${BASE_URL}/`);
  const { version, modules } = parseHomePage(homeHtml);
  console.log(`Reference version ${version} — ${modules.length} modules`);

  const selected = onlyModules ? modules.filter((m) => onlyModules.has(m.id)) : modules;
  if (!selected.length) throw new Error('No modules matched --only');

  const discovered = await mapPool(selected, CONCURRENCY, async (module) => {
    const html = await fetchText(`${BASE_URL}/${module.id}`);
    const methods = parseModulePage(html, module.id);
    console.log(`  ${module.id}: ${methods.length} methods (${module.group})`);
    return { ...module, methods };
  });

  const total = discovered.reduce((sum, module) => sum + module.methods.length, 0);
  console.log(`Describing ${total} methods ...`);

  let done = 0;
  const reference: SDSApiReference = {
    source: BASE_URL,
    version,
    scrapedAt: new Date().toISOString(),
    modules: [],
  };

  const parsedModules = await mapPool(discovered, CONCURRENCY, async (module) => {
    const methods = await mapPool(module.methods, CONCURRENCY, async (method) => {
      const describeUrl = `${BASE_URL}/describeMethod/${module.id}.${method.name}`;
      const html = await fetchText(describeUrl);
      const details = parseMethodPage(html);
      done += 1;
      if (done % 50 === 0) console.log(`  ${done}/${total}`);

      const documentedParams = details.params ?? [];
      const params: SDSParamMeta[] = method.routeParams.map((routeParam) => {
        const documented = documentedParams.find((param) => param.name === routeParam.name);
        if (documented) return documented;
        // Fall back to the route info when the table does not list the parameter.
        return {
          name: routeParam.name,
          type: 'string',
          optional: routeParam.optional,
        };
      });

      // Keep parameters that are documented but missing from the route.
      for (const param of documentedParams) {
        if (!params.some((existing) => existing.name === param.name)) params.push(param);
      }

      const meta: SDSMethodMeta = {
        module: module.id,
        name: method.name,
        path: ['/' + module.id, method.name, ...method.routeSegments].join('/'),
        params,
      };
      if (details.description) meta.description = details.description;
      if (details.example) meta.example = details.example;
      if (details.result) meta.result = details.result;
      if (details.maxLimit !== undefined) meta.maxLimit = details.maxLimit;
      if (method.section) meta.section = method.section;
      return meta;
    });

    const moduleMeta: SDSModuleMeta = {
      id: module.id,
      key: toNamespaceKey(module.id),
      group: module.group,
      methods,
    };
    return moduleMeta;
  });

  reference.modules = parsedModules;

  const methodCount = reference.modules.reduce((sum, module) => sum + module.methods.length, 0);
  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(reference, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${OUT_PATH} — ${reference.modules.length} modules, ${methodCount} methods`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
