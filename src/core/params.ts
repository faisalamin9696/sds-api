/**
 * Argument normalization, validation and path building.
 *
 * Every generated method accepts its parameters either positionally (route
 * order) or as a single object keyed by parameter name, plus an optional
 * trailing {@link Callback}. This module turns those calls into the encoded
 * path segments SDS expects.
 */
import { SDSArgumentError, SDSValidationError } from '../errors';
import type { SDSMethodMeta, SDSParamMeta } from '../meta-types';
import type { Callback } from '../types';

/** Result of {@link resolveSegments}: raw (not yet URL encoded) segment values. */
export type SegmentValues = string[];

export interface ResolveOptions {
  /** Perform client side validation (type, range, allowed values, required). */
  validate: boolean;
}

/** Removes a trailing callback from a positional argument list. */
export function splitCallback(args: readonly unknown[]): {
  callback?: Callback<any>;
  values: unknown[];
} {
  if (args.length > 0 && typeof args[args.length - 1] === 'function') {
    return {
      callback: args[args.length - 1] as Callback<any>,
      values: args.slice(0, -1),
    };
  }
  return { values: [...args] };
}

/**
 * A *plain* object: `{ … }` with `Object.prototype` (or a null prototype) —
 * explicitly **not** `Date`s, `Map`s or other class instances, which must be
 * treated as positional values (a lone `new Date(…)` argument would otherwise
 * be swallowed by the object-style calling convention and end up empty).
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const isMissing = (value: unknown): boolean => value === undefined || value === null;

const describeValue = (value: unknown): string => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return `array(${value.length})`;
  if (value === null) return 'null';
  if (typeof value === 'object') return 'object';
  return String(value);
};

/**
 * Community parameters take a **hive community id** (e.g. `hive-160125`),
 * which is the hivemind account of the community. SDS accepts anything else
 * but silently returns an empty result — a bare id (`160125`), an upper case
 * form (`HIVE-160125`), a community title (`steemit-news`) or a regular
 * account (`alice`) all answer with `rows: []`.
 */
export const COMMUNITY_ID_PATTERN = /^hive-[a-z0-9][a-z0-9-]*$/;

/**
 * Whether a parameter expects a hive community id: an `account_name`
 * parameter whose name mentions "community" (e.g. `community`).
 *
 * Shared by the runtime validator and the documentation generator so the
 * examples and the validation can never disagree.
 */
export const isCommunityParam = (param: { name: string; type: string }): boolean =>
  param.type.trim().toLowerCase() === 'account_name' && /community/i.test(param.name);

/**
 * Whether a parameter is a **timestamp**: an `int` parameter named `…time` /
 * `…date` / `…timestamp` (`blockTime`, `fromTime`, `toTime`, including JSON
 * fields such as `query.fromTime`).
 *
 * SDS wants unix **seconds** for these. A millisecond value would be read as a
 * second in the far future and silently clamp to the newest block, so the
 * client converts every accepted date form to seconds itself.
 */
export const isTimestampParam = (param: { name: string; type: string }): boolean => {
  if (param.type.trim().toLowerCase() !== 'int') return false;
  const leaf = param.name.split('.').pop() ?? param.name;
  return /time$|date$|timestamp$/i.test(leaf);
};

/**
 * Numbers at or above 100 000 000 000 cannot be unix seconds (that would be
 * the year 5138) — such values are always **milliseconds** (1973 and later),
 * while every plausible SDS timestamp (Steem launched 2016) has at most 10
 * digits as seconds.
 */
const MILLISECONDS_THRESHOLD = 100_000_000_000;

/** Normalizes a number to unix seconds (12+ digit values are read as ms). */
function numericToSeconds(value: number): number {
  return Math.abs(value) >= MILLISECONDS_THRESHOLD ? Math.round(value / 1000) : Math.round(value);
}

const YEAR_MONTH = /^\d{4}[-/]\d{1,2}$/;
const DATE_ONLY = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;
const NAIVE_DATETIME = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}[T ]\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;

/**
 * Parses a date/time string into unix seconds.
 *
 * Values without a time zone (`2020-09-13`, `2020-09-13 12:30:00`) are
 * interpreted as **UTC** so the result never depends on the machine's local
 * time zone; anything with an explicit zone (or another format `Date` parses,
 * e.g. RFC 2822) keeps that zone.
 */
function parseDateSeconds(text: string): number | undefined {
  const toSeconds = (ms: number): number | undefined =>
    Number.isNaN(ms) ? undefined : Math.round(ms / 1000);
  const normalized = text.replace(/\//g, '-');

  if (YEAR_MONTH.test(normalized)) {
    const [year, month] = normalized.split('-').map(Number);
    return toSeconds(Date.UTC(year, month - 1, 1));
  }
  if (DATE_ONLY.test(normalized)) {
    const [year, month, day] = normalized.split('-').map(Number);
    return toSeconds(Date.UTC(year, month - 1, day));
  }
  if (NAIVE_DATETIME.test(normalized)) {
    return toSeconds(Date.parse(`${normalized.replace(' ', 'T')}Z`));
  }
  return toSeconds(Date.parse(text));
}

/** How to fix a rejected timestamp — appended to every timestamp error. */
const TIMESTAMP_HINT =
  'Pass a Date, a date/time string (e.g. "2020-09-13", "2020-09-13 12:30:00", ' +
  '"2020-09-13T12:30:00+02:00") or a unix timestamp in seconds ' +
  '(12+ digit numbers are read as milliseconds).';

/**
 * Converts any accepted timestamp form to unix **seconds** (the unit SDS
 * expects): a `Date`, a date/time string (`2020-09-13`, `2020/09/13`,
 * `2020-09-13 12:30:00`, ISO with zone, …) or a number in seconds or
 * milliseconds. Returns `undefined` when the value cannot be understood.
 */
export function coerceTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isNaN(ms) ? undefined : Math.round(ms / 1000);
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? numericToSeconds(value) : undefined;
  }
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) return undefined;
    const numeric = toNumber(text);
    if (numeric !== undefined) return numericToSeconds(numeric);
    return parseDateSeconds(text);
  }
  return undefined;
}

/**
 * Maps the call arguments onto parameter names.
 *
 * - `f({ limit: 10, offset: 5 })` → object style
 * - `f(10, 5)` → positional style (route order)
 * - `f()` → all optional parameters omitted
 */
export function normalizeArguments(
  meta: SDSMethodMeta,
  args: readonly unknown[],
): Map<string, unknown> {
  const values = new Map<string, unknown>();
  if (args.length === 0) return values;

  const where = `${meta.module}.${meta.name}`;

  if (args.length === 1 && isPlainObject(args[0])) {
    const input = args[0];
    const keys = Object.keys(input);
    const known = new Set(meta.params.map((param) => param.name));
    const knownKeys = keys.filter((key) => known.has(key));
    const firstParam = meta.params[0];
    const structuredFirst = firstParam !== undefined && firstParam.type.startsWith('json');

    // `f({ limit: 5 })` is the object style. A lone object without a single
    // valid parameter name is the positional value of a structured first
    // parameter instead, e.g. `getTransfers({ fromTime, toTime })`.
    const objectStyle =
      knownKeys.length > 0 || !structuredFirst || keys.length === 0;

    if (objectStyle) {
      const unknownKeys = keys.filter((key) => !known.has(key));
      if (unknownKeys.length) {
        throw new SDSArgumentError(
          `Unknown parameter(s) ${unknownKeys.map((key) => `"${key}"`).join(', ')} for ${where}. ` +
            `Valid parameters: ${meta.params.map((p) => p.name).join(', ') || '(none)'}`,
          { module: meta.module, method: meta.name },
        );
      }
      for (const [key, value] of Object.entries(input)) values.set(key, value);
      return values;
    }

    values.set(firstParam.name, input);
    return values;
  }

  if (args.length > meta.params.length) {
    throw new SDSArgumentError(
      `${where} accepts at most ${meta.params.length} parameter(s), got ${args.length}`,
      { module: meta.module, method: meta.name },
    );
  }

  meta.params.forEach((param, index) => {
    if (index < args.length) values.set(param.name, args[index]);
  });
  return values;
}

/**
 * Converts call arguments into the list of (unencoded) values that fills the
 * route template of `meta.path`.
 *
 * Optional parameters are only sent when a later parameter needs them; in that
 * case the documented default is used (SDS routes are positional, a segment
 * cannot be skipped).
 */
export function resolveSegments(
  meta: SDSMethodMeta,
  args: readonly unknown[],
  options: ResolveOptions,
): SegmentValues {
  const provided = normalizeArguments(meta, args);
  const where = `${meta.module}.${meta.name}`;

  const missingRequired = meta.params.filter(
    (param) => !param.optional && isMissing(provided.get(param.name)),
  );
  if (missingRequired.length) {
    const names = missingRequired.map((param) => `"${param.name}"`).join(', ');
    throw new SDSValidationError(
      `Missing required parameter(s) ${names} for ${where}`,
      {
        module: meta.module,
        method: meta.name,
        param: missingRequired[0].name,
        expected: 'required parameter',
        value: undefined,
      },
    );
  }

  let lastProvided = -1;
  meta.params.forEach((param, index) => {
    if (!isMissing(provided.get(param.name))) lastProvided = index;
  });

  const segments: SegmentValues = [];
  for (let index = 0; index <= lastProvided; index++) {
    const param = meta.params[index];
    let value = provided.get(param.name);

    if (isMissing(value)) {
      if (param.default !== undefined) {
        value = param.default;
      } else if (placeholderType(param)) {
        // SDS documents `null` for optional values without an explicit default
        // (e.g. `observer`) and accepts the literal `null` segment.
        value = 'null';
      } else {
        throw new SDSValidationError(
          `Parameter "${param.name}" of ${where} must be set, because SDS routes are ` +
            `positional and "${meta.params[lastProvided].name}" is provided after it ` +
            `(no default is documented for "${param.name}")`,
          {
            module: meta.module,
            method: meta.name,
            param: param.name,
            expected: 'a value (no documented default)',
            value: undefined,
          },
        );
      }
    }

    segments.push(
      options.validate
        ? formatParam(meta, param, value)
        : basicFormat(withTimestampCoerced(param, value)),
    );
  }

  return segments;
}

/** Timestamp field names (leaves) documented for a structured parameter. */
function timestampFieldNames(param: SDSParamMeta): Set<string> {
  const names = new Set<string>();
  for (const field of param.fields ?? []) {
    if (!isTimestampParam(field)) continue;
    names.add(field.name.split('.').pop() ?? field.name);
  }
  return names;
}

/**
 * Recursively converts the documented timestamp fields of a JSON payload to
 * unix seconds (`{ fromTime: "2020-09-13" }` → `{ fromTime: 1599961600 }`),
 * reporting whether anything changed so unmodified payloads keep their exact
 * input formatting.
 */
function coerceJsonTimestamps(
  meta: SDSMethodMeta,
  param: SDSParamMeta,
  payload: unknown,
  names: Set<string>,
): { value: unknown; changed: boolean } {
  let changed = false;

  const walk = (node: unknown, depth: number): unknown => {
    if (depth > 6 || node === null || typeof node !== 'object') return node;
    if (Array.isArray(node)) {
      return node.map((item) => {
        const next = walk(item, depth + 1);
        if (next !== item) changed = true;
        return next;
      });
    }
    const prototype = Object.getPrototypeOf(node);
    // Only descend into plain objects — `Date`s and class instances are left
    // for JSON.stringify to handle.
    if (prototype !== Object.prototype && prototype !== null) return node;

    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(node as Record<string, unknown>)) {
      if (names.has(key) && item !== null && item !== undefined) {
        const seconds = coerceTimestamp(item);
        if (seconds === undefined) {
          throw new SDSValidationError(
            `Field "${key}" of parameter "${param.name}" of ${meta.module}.${meta.name} must be a ` +
              `timestamp, got ${item instanceof Date ? 'Date(Invalid Date)' : describeValue(item)}. ` +
              TIMESTAMP_HINT,
            {
              module: meta.module,
              method: meta.name,
              param: `${param.name}.${key}`,
              value: item,
              expected: 'Date, date/time string or unix timestamp in seconds',
            },
          );
        }
        if (seconds !== item) changed = true;
        result[key] = seconds;
      } else {
        const next = walk(item, depth + 1);
        if (next !== item) changed = true;
        result[key] = next;
      }
    }
    return result;
  };

  return { value: walk(payload, 0), changed };
}

/** Validates and converts a single parameter value to its string form. */
export function formatParam(
  meta: SDSMethodMeta,
  param: SDSParamMeta,
  value: unknown,
): string {
  const context = {
    module: meta.module,
    method: meta.name,
    param: param.name,
    value,
  };
  const type = param.type.trim().toLowerCase();
  const range = rangeText(param);

  // Timestamp parameters accept any date form — `Date`, date string, seconds
  // or milliseconds — and are normalized to unix seconds (what SDS expects)
  // before the regular integer validation runs.
  if (type === 'int' && isTimestampParam(param)) {
    const seconds = coerceTimestamp(value);
    if (seconds === undefined) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a timestamp, got ` +
          `${value instanceof Date ? 'Date(Invalid Date)' : describeValue(value)}. ${TIMESTAMP_HINT}`,
        {
          ...context,
          expected: 'Date, date/time string or unix timestamp in seconds',
        },
      );
    }
    value = seconds;
  }

  if (type === 'int') {
    const number = toNumber(value);
    if (number === undefined || !Number.isInteger(number)) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be an integer${range}, got ${describeValue(value)}`,
        { ...context, expected: `integer${range}` },
      );
    }
    assertRange(param, number, context, range);
    return String(number);
  }

  if (type === 'float' || type === 'number') {
    const number = toNumber(value);
    if (number === undefined) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a number${range}, got ${describeValue(value)}`,
        { ...context, expected: `number${range}` },
      );
    }
    assertRange(param, number, context, range);
    return String(number);
  }

  if (type === 'bool' || type === 'boolean') {
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === 1 || value === '1' || value === 'true') return 'true';
    if (value === 0 || value === '0' || value === 'false') return 'false';
    throw new SDSValidationError(
      `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a boolean (true/false/1/0), got ${describeValue(value)}`,
      { ...context, expected: 'boolean' },
    );
  }

  if (type === 'account_name') {
    if (typeof value !== 'string' || !value.trim()) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be an account name, got ${describeValue(value)}`,
        { ...context, expected: 'account name (string)' },
      );
    }
    if (/[\s/]/.test(value)) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a valid account name, got ${describeValue(value)}`,
        { ...context, expected: 'account name without spaces or slashes' },
      );
    }
    if (isCommunityParam(param) && !COMMUNITY_ID_PATTERN.test(value)) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a hive community id ` +
          `starting with "hive-" (e.g. "hive-160125"), got ${describeValue(value)}`,
        {
          ...context,
          expected: 'hive community id, e.g. "hive-160125"',
        },
      );
    }
    return value;
  }

  if (type.startsWith('hex_string')) {
    if (typeof value !== 'string' || !/^[0-9a-f]{40}$/i.test(value)) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a 40 character hex string, got ${describeValue(value)}`,
        { ...context, expected: '40 character hex string' },
      );
    }
    return value;
  }

  if (type === 'fixed_value') {
    const text = stringifyScalar(value);
    if (param.allowedValues?.length && !param.allowedValues.includes(text)) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must be one of: ${param.allowedValues.join(' | ')}, got ${describeValue(value)}`,
        { ...context, expected: param.allowedValues.join(' | ') },
      );
    }
    return text;
  }

  if (type === 'fixed_csv') {
    const items = splitCsv(value);
    if (!items.length) {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} must contain at least one value`,
        { ...context, expected: param.allowedValues?.join(' | ') ?? 'comma separated values' },
      );
    }
    for (const item of items) {
      if (item === '*') continue;
      if (param.allowedValues?.length && !param.allowedValues.includes(item)) {
        throw new SDSValidationError(
          `Invalid value "${item}" for parameter "${param.name}" of ${meta.module}.${meta.name}. Allowed: ${param.allowedValues.join(' | ')}`,
          { ...context, expected: param.allowedValues.join(' | '), value: item },
        );
      }
    }
    return items.join(',');
  }

  if (type.endsWith('_csv') || type === 'csv') {
    const items = splitCsv(value);
    const expectInt = type.startsWith('int');
    const expectAccount = type.startsWith('account_name');
    for (const item of items) {
      if (expectInt && toNumber(item) === undefined) {
        throw new SDSValidationError(
          `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a comma separated list of integers, got ${describeValue(value)}`,
          { ...context, expected: 'comma separated integers' },
        );
      }
      if (expectAccount && /[\s/]/.test(item)) {
        throw new SDSValidationError(
          `Parameter "${param.name}" of ${meta.module}.${meta.name} must be a comma separated list of account names, got ${describeValue(value)}`,
          { ...context, expected: 'comma separated account names' },
        );
      }
    }
    return items.join(',');
  }

  if (type.startsWith('json')) {
    const timeFields = timestampFieldNames(param);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      let parsed: unknown;
      try {
        parsed = JSON.parse(trimmed);
      } catch (error) {
        throw new SDSValidationError(
          `Parameter "${param.name}" of ${meta.module}.${meta.name} must be valid JSON, got ${describeValue(value)}`,
          { ...context, expected: 'JSON string or object' },
        );
      }
      if (!timeFields.size) return trimmed;
      const coerced = coerceJsonTimestamps(meta, param, parsed, timeFields);
      return coerced.changed ? (JSON.stringify(coerced.value) ?? trimmed) : trimmed;
    }
    if (value === undefined) return 'null';
    const coerced = timeFields.size
      ? coerceJsonTimestamps(meta, param, value, timeFields)
      : { value, changed: false };
    try {
      return JSON.stringify(coerced.value) ?? 'null';
    } catch {
      throw new SDSValidationError(
        `Parameter "${param.name}" of ${meta.module}.${meta.name} could not be serialized to JSON`,
        { ...context, expected: 'JSON serializable value' },
      );
    }
  }

  return stringifyScalar(value);
}

/**
 * Best-effort timestamp conversion used when client side validation is
 * disabled: date forms are still normalized to unix seconds (that is
 * conversion, not validation), but unparseable values pass through untouched
 * instead of throwing — `validate: false` means "do not validate".
 */
function withTimestampCoerced(param: SDSParamMeta, value: unknown): unknown {
  if (!isTimestampParam(param)) return value;
  const seconds = coerceTimestamp(value);
  return seconds === undefined ? value : seconds;
}

/** String conversion used when client side validation is disabled. */
export function basicFormat(value: unknown): string {
  if (Array.isArray(value)) return value.map((item) => basicFormat(item)).join(',');
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined || value === null) return 'null';
  return String(value);
}

/**
 * Fills the route template (e.g. `/blocks_api/getBlocksInRange/:fromBlockNum-:toBlockNum/:limit?`)
 * with the given, already encoded values. Tokens of parameters that were not
 * sent (trailing optional parameters) are dropped together with their segment.
 */
export function buildPath(
  template: string,
  values: readonly string[],
  context?: { module?: string; method?: string },
): string {
  const parts = template.split('/');
  let index = 0;

  const filled = parts
    .map((part) => {
      const tokens = part.match(/:[A-Za-z_][A-Za-z0-9_]*\??/g) ?? [];
      if (!tokens.length) return part;
      if (index >= values.length) {
        // Trailing optional segment: it is omitted together with its tokens.
        return null;
      }
      if (index + tokens.length > values.length) {
        throw new SDSValidationError(
          `Cannot build the route "${template}": "${part}" needs ${tokens.length} value(s) but only ${values.length - index} left`,
          context ?? {},
        );
      }
      return part.replace(/:([A-Za-z_][A-Za-z0-9_]*)(\??)/g, () => values[index++]);
    })
    .filter((part): part is string => part !== null);

  return filled.join('/');
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || !/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function rangeText(param: SDSParamMeta): string {
  if (param.min !== undefined && param.max !== undefined) return ` between ${param.min} and ${param.max}`;
  if (param.min !== undefined) return ` >= ${param.min}`;
  if (param.max !== undefined) return ` <= ${param.max}`;
  return '';
}

function assertRange(
  param: SDSParamMeta,
  number: number,
  context: { module?: string; method?: string; param?: string; value?: unknown },
  range: string,
): void {
  if (param.min !== undefined && number < param.min) {
    throw new SDSValidationError(
      `Parameter "${param.name}" of ${context.module}.${context.method} must be${range}, got ${number}`,
      { ...context, expected: `>= ${param.min}` },
    );
  }
  if (param.max !== undefined && number > param.max) {
    throw new SDSValidationError(
      `Parameter "${param.name}" of ${context.module}.${context.method} must be${range}, got ${number}`,
      { ...context, expected: `<= ${param.max}` },
    );
  }
}

/** Types for which SDS accepts the literal `null` placeholder segment. */
function placeholderType(param: SDSParamMeta): boolean {
  const type = param.type.trim().toLowerCase();
  return type === 'account_name' || type === 'string';
}

function splitCsv(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? item.trim() : String(item)))
    : String(value)
        .split(',')
        .map((item) => item.trim());
  return items.filter((item) => item.length > 0);
}

function stringifyScalar(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return 'null';
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
