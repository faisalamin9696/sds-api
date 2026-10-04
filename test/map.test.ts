import { describe, expect, it } from 'vitest';
import { isSDSTable, mapSds } from '../src/map';
import { SDS } from '../src/client';

describe('mapSds', () => {
  const table = {
    cols: { link_id: 0, author: 6, permlink: 7 },
    rows: [
      [1, 0, 0, 0, 0, '', 'alice', 'hello'],
      [2, 0, 0, 0, 0, '', 'bob', 'world'],
    ],
  };

  it('maps a cols/rows table to row objects', () => {
    expect(mapSds(table)).toEqual([
      { link_id: 1, author: 'alice', permlink: 'hello' },
      { link_id: 2, author: 'bob', permlink: 'world' },
    ]);
  });

  it('maps by the cols index, not by key order', () => {
    // Keys intentionally out of ascending index order:
    // permlink → 2, link_id → 0, author → 1.
    const shuffled = {
      cols: { permlink: 2, link_id: 0, author: 1 },
      rows: [['x', 42, 'alice']],
    };
    expect(mapSds(shuffled)).toEqual([{ permlink: 'alice', link_id: 'x', author: 42 }]);
  });

  it('supports array style cols', () => {
    expect(mapSds({ cols: ['a', 'b'], rows: [[1, 2]] })).toEqual([{ a: 1, b: 2 }]);
  });

  it('keeps rows that are already keyed objects', () => {
    expect(mapSds({ cols: { a: 0 }, rows: [{ a: 1, extra: true }] })).toEqual([
      { a: 1, extra: true },
    ]);
  });

  it('returns [] for a table without rows', () => {
    expect(mapSds({ cols: { a: 0 } })).toEqual([]);
    expect(mapSds({ cols: { a: 0 }, rows: [] })).toEqual([]);
  });

  it('handles out of range values as undefined', () => {
    expect(mapSds({ cols: { a: 0, b: 1 }, rows: [[1]] })).toEqual([{ a: 1, b: undefined }]);
  });

  it('maps scalar rows of a single column table', () => {
    expect(mapSds({ cols: { name: 0 }, rows: ['alice'] as unknown[] })).toEqual([{ name: 'alice' }]);
  });

  it('unwraps a raw { code, result } envelope', () => {
    expect(mapSds({ code: 0, result: table })).toEqual(mapSds(table));
    expect(mapSds({ code: 0, result: [1, 2] })).toEqual([1, 2]);
  });

  it('passes non table payloads through unchanged', () => {
    const object = { STM: '1000000', VESTS: '1' };
    expect(mapSds(object)).toBe(object);
    expect(mapSds([1, 2, 3])).toEqual([1, 2, 3]);
    expect(mapSds(null)).toBeNull();
    expect(mapSds(undefined)).toBeUndefined();
    expect(mapSds('text')).toBe('text');
    expect(mapSds(42)).toBe(42);
    expect(mapSds({ code: -1, error: 'boom' })).toEqual({ code: -1, error: 'boom' });
  });

  it('is usable as a promise continuation', async () => {
    const promise = Promise.resolve(table);
    await expect(promise.then(mapSds)).resolves.toEqual([
      { link_id: 1, author: 'alice', permlink: 'hello' },
      { link_id: 2, author: 'bob', permlink: 'world' },
    ]);
  });

  it('works on a real client call (mocked)', async () => {
    const fetch = async () => new Response(JSON.stringify({ code: 0, result: table }));
    const sds = new SDS({ fetch, retries: 0 });
    const rows = mapSds(await sds.call('feeds_api', 'getActivePostsByTrending', null));
    expect(rows).toHaveLength(2);
    expect(rows[0].author).toBe('alice');
  });
});

describe('isSDSTable', () => {
  it('detects tables', () => {
    expect(isSDSTable({ cols: { a: 0 }, rows: [] })).toBe(true);
    expect(isSDSTable({ cols: ['a'], rows: [] })).toBe(true);
    expect(isSDSTable({ cols: { a: 0 } })).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isSDSTable(null)).toBe(false);
    expect(isSDSTable([1])).toBe(false);
    expect(isSDSTable({ rows: [] })).toBe(false);
    expect(isSDSTable({ cols: 'a' })).toBe(false);
    expect(isSDSTable('x')).toBe(false);
  });
});
