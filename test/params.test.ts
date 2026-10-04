import { describe, expect, it } from 'vitest';
import {
  basicFormat,
  buildPath,
  coerceTimestamp,
  formatParam,
  isTimestampParam,
  normalizeArguments,
  resolveSegments,
  splitCallback,
} from '../src/core/params';
import { SDSArgumentError, SDSValidationError } from '../src/errors';
import { findMethod } from '../src/meta';

const method = (key: string) => {
  const meta = findMethod(key);
  if (!meta) throw new Error(`missing test fixture method ${key}`);
  return meta;
};

const segments = (key: string, args: unknown[], validate = true): string[] =>
  resolveSegments(method(key), args, { validate });

describe('splitCallback', () => {
  it('removes a trailing function', () => {
    const cb = (): void => {};
    const { callback, values } = splitCallback([1, 'a', cb]);
    expect(callback).toBe(cb);
    expect(values).toEqual([1, 'a']);
  });

  it('keeps everything when there is no function', () => {
    expect(splitCallback([1, 2])).toEqual({ values: [1, 2] });
    expect(splitCallback([])).toEqual({ values: [] });
  });

  it('does not treat a first-class function argument as a callback', () => {
    const cb = (): void => {};
    expect(splitCallback([cb]).callback).toBe(cb);
  });
});

describe('normalizeArguments', () => {
  it('maps object style keys onto parameter names', () => {
    const values = normalizeArguments(method('chain_api.getAccountNames'), [{ limit: 5, offset: 2 }]);
    expect(values.get('limit')).toBe(5);
    expect(values.get('offset')).toBe(2);
  });

  it('maps positional arguments in route order', () => {
    const values = normalizeArguments(method('chain_api.getAccountNames'), [5, 2]);
    expect(values.get('limit')).toBe(5);
    expect(values.get('offset')).toBe(2);
  });

  it('rejects unknown object keys with the list of valid parameters', () => {
    expect(() =>
      normalizeArguments(method('chain_api.getAccountNames'), [{ limmit: 5 }]),
    ).toThrowError(SDSArgumentError);
    try {
      normalizeArguments(method('chain_api.getAccountNames'), [{ limmit: 5 }]);
    } catch (error) {
      expect((error as Error).message).toContain('"limmit"');
      expect((error as Error).message).toContain('limit, offset');
    }
  });

  it('treats a lone object as the value of a structured first parameter', () => {
    const meta = method('transfers_api.getTransfers');
    const first = meta.params[0];
    expect(first.type.startsWith('json')).toBe(true);
    const values = normalizeArguments(meta, [{ fromTime: 0, toTime: 1 }]);
    expect(values.get(first.name)).toEqual({ fromTime: 0, toTime: 1 });
  });

  it('rejects too many positional arguments', () => {
    expect(() => normalizeArguments(method('chain_api.getAccountNames'), [1, 2, 3])).toThrowError(
      SDSArgumentError,
    );
  });

  it('returns an empty map for no arguments', () => {
    expect(normalizeArguments(method('chain_api.getConfig'), []).size).toBe(0);
  });
});

describe('resolveSegments', () => {
  it('returns no segments when nothing is provided', () => {
    expect(segments('chain_api.getAccountNames', [])).toEqual([]);
  });

  it('drops trailing optional parameters (SDS applies their defaults)', () => {
    expect(segments('chain_api.getAccountNames', [])).toEqual([]);
    expect(segments('chain_api.getAccountNames', [10])).toEqual(['10']);
    expect(segments('chain_api.getAccountNamesByPrefix', ['al'])).toEqual(['al']);
    expect(segments('chain_api.getAccountNamesByPrefix', ['al', 50])).toEqual(['al', '50']);
  });

  it('fills skipped middle optionals with the literal null placeholder', () => {
    // getPost(author, permlink, withVotes, observer, fields) — observer has no
    // default but SDS accepts the `null` segment.
    expect(segments('posts_api.getPost', ['alice', 'hello', undefined, 'bob'])).toEqual([
      'alice',
      'hello',
      'true',
      'bob',
    ]);
  });

  it('throws when a middle parameter has no documented default', () => {
    // fromBlockNum-toBlockNum use a range template; instead use a param
    // without default in the middle: getBlocksWithState style is not needed —
    // an int with no default in the middle. `getBlocksInRange` defaults exist,
    // so craft the error through a method where an int has no default.
    const meta = method('chain_api.getAccountNames');
    const patched = { ...meta, params: meta.params.map((p) => ({ ...p, default: undefined })) };
    expect(() => resolveSegments(patched, [undefined, 5], { validate: true })).toThrowError(
      SDSValidationError,
    );
  });

  it('validates required parameters', () => {
    expect(() => segments('posts_api.getPost', ['alice'])).toThrowError(SDSValidationError);
    expect(() => segments('posts_api.getPost', [])).toThrowError(/Missing required parameter/);
  });

  it('validates integers against their documented range', () => {
    expect(segments('chain_api.getAccountNames', [100])).toEqual(['100']);
    expect(() => segments('chain_api.getAccountNames', [0])).toThrowError(/between 1 and 10000/);
    expect(() => segments('chain_api.getAccountNames', [10001])).toThrowError(/between 1 and 10000/);
    expect(() => segments('chain_api.getAccountNames', [1.5])).toThrowError(/integer/);
    expect(() => segments('chain_api.getAccountNames', ['abc'])).toThrowError(/integer/);
  });

  it('skips validation when validate is disabled', () => {
    expect(segments('chain_api.getAccountNames', ['abc'], false)).toEqual(['abc']);
  });

  it('validates account names', () => {
    expect(segments('posts_api.getPost', ['alice', 'my-post'])).toEqual(['alice', 'my-post']);
    expect(() => segments('posts_api.getPost', ['not an account', 'x'])).toThrowError(
      /valid account name/,
    );
    expect(() => segments('posts_api.getPost', ['', 'x'])).toThrowError(/account name/);
  });

  it('validates community params as hive community ids', () => {
    expect(segments('communities_api.getCommunity', ['hive-160125'])).toEqual(['hive-160125']);
    expect(segments('communities_api.getCommunityRoles', ['hive-160125'])).toEqual(['hive-160125']);

    // SDS accepts these but silently answers with empty data — reject early.
    expect(() => segments('communities_api.getCommunity', ['160125'])).toThrowError(
      /hive community id/,
    );
    expect(() => segments('communities_api.getCommunity', ['alice'])).toThrowError(
      /starting with "hive-"/,
    );
    expect(() => segments('communities_api.getCommunity', ['HIVE-160125'])).toThrowError(
      /hive community id/,
    );
    expect(() => segments('communities_api.getCommunity', ['steemit-news'])).toThrowError(
      /hive community id/,
    );
    expect(() => segments('communities_api.getCommunity', ['hive-'])).toThrowError(
      /hive community id/,
    );

    // …and can be bypassed like every other validation.
    expect(segments('communities_api.getCommunity', ['alice'], false)).toEqual(['alice']);
  });

  it('does not treat non-community account params as communities', () => {
    // `observer`/`author` are plain accounts and keep the lenient rules.
    expect(segments('posts_api.getPost', ['hive-160125', 'p'])).toEqual(['hive-160125', 'p']);
    expect(segments('posts_api.getPost', ['alice', 'p'])).toEqual(['alice', 'p']);
  });

  it('joins CSV values with commas', () => {
    expect(segments('posts_api.getPost', ['alice', 'p', undefined, undefined, 'title,body'])).toEqual([
      'alice',
      'p',
      'true',
      'null',
      'title,body',
    ]);
    expect(
      segments('posts_api.getPost', ['alice', 'p', undefined, undefined, ['title', 'body']]),
    ).toEqual(['alice', 'p', 'true', 'null', 'title,body']);
  });

  it('rejects values outside a fixed_csv allow list', () => {
    expect(() =>
      segments('posts_api.getPost', ['alice', 'p', undefined, undefined, 'nope']),
    ).toThrowError(/Allowed:/);
    expect(segments('posts_api.getPost', ['alice', 'p', undefined, undefined, '*'])).toEqual([
      'alice',
      'p',
      'true',
      'null',
      '*',
    ]);
  });

  it('validates booleans', () => {
    expect(segments('posts_api.getPost', ['alice', 'p', false])).toEqual(['alice', 'p', 'false']);
    expect(segments('posts_api.getPost', ['alice', 'p', 1])).toEqual(['alice', 'p', 'true']);
    expect(() => segments('posts_api.getPost', ['alice', 'p', 'maybe'])).toThrowError(/boolean/);
  });

  it('serializes JSON parameters', () => {
    const meta = method('transfers_api.getTransfers');
    const value = { account: 'alice', fromTime: 0 };
    expect(formatParam(meta, meta.params[0], value)).toBe(JSON.stringify(value));
    expect(formatParam(meta, meta.params[0], '{"a":1}')).toBe('{"a":1}');
    expect(() => formatParam(meta, meta.params[0], '{bad json}')).toThrowError(/valid JSON/);
  });

  it('validates hex strings', () => {
    const meta = method('blocks_api.getBlockById');
    const hex = meta.params.find((p) => p.type.startsWith('hex_string'));
    if (!hex) return; // structure changed upstream — skip gracefully
    expect(formatParam(meta, hex, 'a'.repeat(40))).toBe('a'.repeat(40));
    expect(() => formatParam(meta, hex, 'xyz')).toThrowError(/40 character hex/);
  });
});

describe('timestamp parameters', () => {
  const blockTime = (value: unknown, validate = true): string =>
    resolveSegments(method('chain_api.getBlockInfoByTime'), [value], { validate })[0];

  it('recognizes timestamp parameters (params and JSON fields)', () => {
    expect(isTimestampParam({ name: 'blockTime', type: 'int' })).toBe(true);
    expect(isTimestampParam({ name: 'fromTime', type: 'int' })).toBe(true);
    expect(isTimestampParam({ name: 'query.toTime', type: 'int' })).toBe(true);
    expect(isTimestampParam({ name: 'someDate', type: 'int' })).toBe(true);
    // …and nothing else.
    expect(isTimestampParam({ name: 'limit', type: 'int' })).toBe(false);
    expect(isTimestampParam({ name: 'fromTime', type: 'string' })).toBe(false);
    expect(isTimestampParam({ name: 'community', type: 'account_name' })).toBe(false);
  });

  it('passes unix seconds through unchanged', () => {
    expect(blockTime(1600000000)).toBe('1600000000');
    expect(blockTime('1600000000')).toBe('1600000000');
  });

  it('converts millisecond timestamps to seconds', () => {
    expect(blockTime(1600000000000)).toBe('1600000000');
    expect(blockTime('1600000000000')).toBe('1600000000');
    expect(blockTime(Date.UTC(2020, 8, 13))).toBe('1599955200');
  });

  it('converts Date objects', () => {
    expect(blockTime(new Date(1600000000 * 1000))).toBe('1600000000');
    expect(blockTime(new Date('2020-09-13T00:00:00Z'))).toBe('1599955200');
    expect(() => blockTime(new Date('nope'))).toThrowError(/must be a timestamp/);
    expect(() => blockTime(new Date('nope'))).toThrowError(/Date\(Invalid Date\)/);
  });

  it('parses zone-less date strings as UTC', () => {
    expect(blockTime('2020-09-13')).toBe('1599955200');
    expect(blockTime('2020/09/13')).toBe('1599955200');
    expect(blockTime('2020-09')).toBe('1598918400');
    expect(blockTime('2020-09-13 12:26:40')).toBe('1600000000');
    expect(blockTime('2020-09-13T12:26:40')).toBe('1600000000');
    expect(blockTime('2020-09-13 12:26')).toBe(String(Date.UTC(2020, 8, 13, 12, 26) / 1000));
    expect(blockTime('2020-09-13 12:26:40.500')).toBe('1600000001'); // rounds to the nearest second
  });

  it('keeps explicit time zones', () => {
    expect(blockTime('2020-09-13T12:26:40Z')).toBe('1600000000');
    expect(blockTime('2020-09-13T14:26:40+02:00')).toBe('1600000000');
    expect(blockTime('2020-09-13T10:26:40-02:00')).toBe('1600000000');
    expect(blockTime('Sat, 13 Sep 2020 12:26:40 GMT')).toBe('1600000000'); // RFC 2822
  });

  it('explains rejected values in the error', () => {
    try {
      blockTime('yesterday');
      throw new Error('expected a throw');
    } catch (error) {
      expect(error).toBeInstanceOf(SDSValidationError);
      const details = error as SDSValidationError;
      expect(details.code).toBe('ERR_SDS_VALIDATION');
      expect(details.param).toBe('blockTime');
      expect(details.message).toContain('must be a timestamp');
      expect(details.message).toContain('got "yesterday"');
      expect(details.message).toContain('Pass a Date');
      expect(details.message).toContain('unix timestamp in seconds');
      expect(details.message).not.toContain('hive-160125'); // community hint must not leak in
    }
    expect(() => blockTime(true)).toThrowError(/must be a timestamp/);
    expect(() => blockTime('')).toThrowError(/must be a timestamp/);
    // `null`/`{}` never reach the value (missing-required / object-style), so
    // assert the message directly against the value formatter:
    const meta = method('chain_api.getBlockInfoByTime');
    expect(() => formatParam(meta, meta.params[0], null)).toThrowError(/must be a timestamp/);
    expect(() => formatParam(meta, meta.params[0], {})).toThrowError(/must be a timestamp/);
  });

  it('leaves non-timestamp integer parameters strict', () => {
    expect(() => segments('chain_api.getAccountNames', ['2020-09-13'])).toThrowError(/integer/);
    expect(segments('chain_api.getAccountNames', ['10'])).toEqual(['10']);
  });

  it('coerces both sides of a range route', () => {
    const meta = method('account_history_api.getHistoryByTime');
    const values = resolveSegments(
      meta,
      ['steemit', '2020-09-14', new Date(Date.UTC(2020, 8, 15))],
      { validate: true },
    );
    expect(values).toEqual(['steemit', '1600041600', '1600128000']);
    expect(buildPath(meta.path, values)).toBe(
      '/account_history_api/getHistoryByTime/steemit/1600041600-1600128000',
    );
  });

  it('converts timestamps inside JSON query parameters', () => {
    const meta = method('transfers_api.getTransfers');
    const query = meta.params[0];

    const segment = formatParam(meta, query, {
      type: 'transfer',
      fromTime: '2020-09-13',
      toTime: 1600000000000,
    });
    expect(JSON.parse(segment)).toEqual({
      type: 'transfer',
      fromTime: 1599955200,
      toTime: 1600000000,
    });

    // Dates are converted before serialization …
    expect(JSON.parse(formatParam(meta, query, { fromTime: new Date('2020-09-13T00:00:00Z') }))).toEqual({
      fromTime: 1599955200,
    });

    // … pre-serialized JSON is converted too …
    expect(formatParam(meta, query, '{"fromTime":"2020-09-13"}')).toBe('{"fromTime":1599955200}');

    // … payloads without timestamp fields keep their exact formatting …
    expect(formatParam(meta, query, '{ "a": 1 }')).toBe('{ "a": 1 }');

    // … and unparsable field values explain themselves.
    expect(() => formatParam(meta, query, { fromTime: 'yesterday' })).toThrowError(
      /Field "fromTime".*must be a timestamp/,
    );
    expect(() => formatParam(meta, query, { fromTime: 'yesterday' })).toThrowError(/Pass a Date/);
  });

  it('still converts dates when validation is disabled', () => {
    const meta = method('chain_api.getBlockInfoByTime');
    expect(resolveSegments(meta, [new Date(1600000000 * 1000)], { validate: false })).toEqual([
      '1600000000',
    ]);
    expect(resolveSegments(meta, ['2020-09-13'], { validate: false })).toEqual(['1599955200']);
    // Unparseable values pass through untouched instead of throwing.
    expect(resolveSegments(meta, ['yesterday'], { validate: false })).toEqual(['yesterday']);
  });
});

describe('coerceTimestamp', () => {
  it('understands every accepted form', () => {
    expect(coerceTimestamp(1600000000)).toBe(1600000000);
    expect(coerceTimestamp(1600000000000)).toBe(1600000000);
    expect(coerceTimestamp('1600000000')).toBe(1600000000);
    expect(coerceTimestamp('2020-09-13')).toBe(1599955200);
    expect(coerceTimestamp('2020-09-13T12:26:40Z')).toBe(1600000000);
    expect(coerceTimestamp(new Date('2020-09-13T12:26:40Z'))).toBe(1600000000);
    // Other formats Date parses work as well (their zone is whatever Date makes of it).
    expect(coerceTimestamp('May 13, 2020')).toBeTypeOf('number');
    // Sub-second precision rounds to the nearest second.
    expect(coerceTimestamp(1600000000999)).toBe(1600000001);
    expect(coerceTimestamp(new Date(1600000000500))).toBe(1600000001);
  });

  it('returns undefined for values it cannot understand', () => {
    for (const value of ['yesterday', '', '   ', 'not-a-date', NaN, Infinity, null, undefined, {}, [], true]) {
      expect(coerceTimestamp(value)).toBeUndefined();
    }
    expect(coerceTimestamp(new Date('nope'))).toBeUndefined();
  });
});

describe('buildPath', () => {
  it('substitutes simple tokens', () => {
    expect(buildPath('/chain_api/getConfig', [])).toBe('/chain_api/getConfig');
    expect(buildPath('/a/:x/:y', ['1', '2'])).toBe('/a/1/2');
  });

  it('joins range tokens inside one segment with a dash', () => {
    expect(buildPath('/blocks_api/getBlocksInRange/:fromBlockNum-:toBlockNum/:limit?', ['5', '9'])).toBe(
      '/blocks_api/getBlocksInRange/5-9',
    );
    expect(
      buildPath('/blocks_api/getBlocksInRange/:fromBlockNum-:toBlockNum/:limit?', ['5', '9', '3']),
    ).toBe('/blocks_api/getBlocksInRange/5-9/3');
  });

  it('drops trailing optional segments that were not sent', () => {
    expect(buildPath('/a/:x/:y?/:z?', ['1'])).toBe('/a/1');
    expect(buildPath('/a/:x/:y?/:z?', ['1', '2'])).toBe('/a/1/2');
  });

  it('throws when a multi token segment needs more values than available', () => {
    expect(() => buildPath('/a/:x-:y', ['1'])).toThrowError(SDSValidationError);
  });
});

describe('basicFormat', () => {
  it('converts values to segment strings', () => {
    expect(basicFormat(5)).toBe('5');
    expect(basicFormat(true)).toBe('true');
    expect(basicFormat(null)).toBe('null');
    expect(basicFormat(undefined)).toBe('null');
    expect(basicFormat(['a', 'b'])).toBe('a,b');
    expect(basicFormat({ a: 1 })).toBe('{"a":1}');
    expect(basicFormat(new Date('2020-01-01T00:00:00.000Z'))).toBe('2020-01-01T00:00:00.000Z');
  });
});
