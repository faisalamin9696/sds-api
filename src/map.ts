/**
 * Response mapping helpers.
 *
 * Many SDS list/search methods answer with a *column oriented* table instead
 * of plain objects:
 *
 * ```json
 * {
 *   "cols": { "link_id": 0, "author": 6, "permlink": 7 },
 *   "rows": [[114136936, "…", "alice", "hello"]]
 * }
 * ```
 *
 * {@link mapSds} turns that into ordinary row objects:
 *
 * ```ts
 * const rows = mapSds(await sds.feeds.getActivePostsByCreated({ limit: 1 }));
 * // [{ link_id: 114136936, author: 'alice', permlink: 'hello' }, …]
 * ```
 *
 * Everything that is not a table (plain JSON objects, arrays, numbers,
 * `{ code, result }` envelopes of raw requests) is returned unchanged, so the
 * function is safe to use as `result.then(mapSds)`.
 */

/** Column map of an SDS table: field name → column index (or a list of names). */
export type SDSCols = Record<string, number> | string[];

/** A single input row: a positional array or an already keyed object. */
export type SDSRowInput = unknown[] | Record<string, unknown>;

/** A mapped row: field name → value. */
export type SDSRow = Record<string, any>;

/** Column oriented SDS payload: `{ cols, rows }`. */
export interface SDSTable {
  /** Field name → column index (or an array of field names). */
  cols: SDSCols;
  /** Rows of positional values (or already keyed objects). Defaults to `[]`. */
  rows?: SDSRowInput[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Whether the value looks like a column oriented SDS table (`{ cols, rows }`).
 *
 * Use it to narrow before calling {@link mapSds} when the input type is
 * `unknown`:
 *
 * ```ts
 * const payload: unknown = await sds.request('/feeds_api/getActivePostsByTrending');
 * if (isSDSTable(payload)) {
 *   const rows: SDSRow[] = mapSds(payload);
 * }
 * ```
 */
export function isSDSTable(value: unknown): value is SDSTable {
  if (!isRecord(value)) return false;
  const { cols } = value;
  if (Array.isArray(cols)) return true;
  return isRecord(cols) && cols !== null;
}

/**
 * Maps an SDS response to plain row objects.
 *
 * - `{ cols, rows }` table → `Array<Record<string, unknown>>`, using the
 *   `cols` name → index mapping (safe even when the keys are not ordered).
 * - `{ code, result }` envelope (raw requests) → unwrapped first.
 * - Any other payload (plain object, array, scalar) → returned unchanged.
 *
 * ```ts
 * const rows = mapSds(table);            // table → rows
 * const config = mapSds(object);         // unchanged
 * const rows = await sds.call('feeds_api', 'getActivePostsByTrending').then(mapSds);
 * ```
 */
export function mapSds(data: SDSTable): SDSRow[];
export function mapSds<T = any>(data: unknown): T;
export function mapSds(data: unknown): unknown {
  const payload = unwrapEnvelope(data);
  if (!isSDSTable(payload)) return payload;

  const cols = payload.cols;
  const rows: SDSRowInput[] = Array.isArray(payload.rows) ? payload.rows : [];
  const names = Array.isArray(cols) ? cols : Object.keys(cols);

  return rows.map((row): SDSRow => {
    if (Array.isArray(row)) {
      const out: SDSRow = {};
      names.forEach((name, position) => {
        const index = Array.isArray(cols) ? position : cols[name];
        out[name] = row[index];
      });
      return out;
    }
    if (isRecord(row)) return { ...row };
    // A scalar row only makes sense for a single column table.
    if (names.length === 0) return {};
    return { [names[0]]: row };
  });
}

/** Unwraps a raw `{ code, result }` envelope (the client does this already). */
function unwrapEnvelope(data: unknown): unknown {
  if (!isRecord(data)) return data;
  if (!('result' in data)) return data;
  const result = data.result;
  if (typeof data.code === 'number' || isSDSTable(result)) return result;
  return data;
}
