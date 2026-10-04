import { describe, expect, it, vi } from 'vitest';
import { SDS, createSDS, DEFAULT_SDS_INSTANCES, registerInstance } from '../src/client';
import {
  SDSApiError,
  SDSHttpError,
  SDSResponseError,
  SDSTimeoutError,
  isSDSError,
} from '../src/errors';
import type { FetchLike } from '../src/types';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const ok = (result: unknown): Response =>
  new Response(JSON.stringify({ code: 0, result }), { status: 200 });

const envelope = (code: number, error: string): Response =>
  new Response(JSON.stringify({ code, error }), { status: 200 });

const html = (status = 404, body = '<html>not found</html>'): Response =>
  new Response(body, { status });

/** Fetch mock that records every call and replies from a handler. */
function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const calls: string[] = [];
  const fetchImpl: FetchLike = async (url, init) => {
    calls.push(url);
    return handler(url, init);
  };
  return { calls, fetchImpl };
}

const client = (fetchImpl: FetchLike, options = {}): SDS =>
  new SDS({ fetch: fetchImpl, retries: 0, retryDelay: 0, ...options });

/* ------------------------------------------------------------------ */

describe('instances', () => {
  it('defaults to sds0', () => {
    const sds = new SDS({ fetch: async () => ok(null) });
    expect(sds.baseUrl).toBe(DEFAULT_SDS_INSTANCES.sds0);
    expect(sds.instance).toBe('sds0');
  });

  it('resolves the bundled instance names', () => {
    expect(new SDS({ instance: 'sds1', fetch: async () => ok(null) }).baseUrl).toBe(
      DEFAULT_SDS_INSTANCES.sds1,
    );
    expect(new SDS({ instance: 'sds', fetch: async () => ok(null) }).baseUrl).toBe(
      DEFAULT_SDS_INSTANCES.sds,
    );
  });

  it('accepts a full URL as instance', () => {
    const sds = new SDS({ instance: 'https://my-sds.example.org/', fetch: async () => ok(null) });
    expect(sds.baseUrl).toBe('https://my-sds.example.org');
  });

  it('accepts a custom baseUrl option', () => {
    const sds = new SDS({ baseUrl: 'https://sds9.example.org/', fetch: async () => ok(null) });
    expect(sds.baseUrl).toBe('https://sds9.example.org');
  });

  it('accepts per client instances', () => {
    const sds = new SDS({
      instance: 'sds9',
      instances: { sds9: 'https://sds9.example.org' },
      fetch: async () => ok(null),
    });
    expect(sds.baseUrl).toBe('https://sds9.example.org');
  });

  it('registers process wide instances', () => {
    registerInstance('sdsTestLocal', 'https://sds-local.example.org/');
    const sds = new SDS({ instance: 'sdsTestLocal', fetch: async () => ok(null) });
    expect(sds.baseUrl).toBe('https://sds-local.example.org');
  });

  it('rejects unknown instance names with a helpful message', () => {
    expect(() => new SDS({ instance: 'nope' })).toThrowError(/Unknown SDS instance "nope"/);
    expect(() => new SDS({ instance: 'nope' })).toThrowError(/baseUrl/);
  });

  it('rejects invalid instance registrations', () => {
    expect(() => registerInstance('bad name', 'https://x.example.org')).toThrowError();
    expect(() => registerInstance('ok', 'ftp://x')).toThrowError(/http/);
  });
});

describe('path building through the client', () => {
  it('calls a no-parameter method', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok({ HAHA: 1 }));
    const result = await client(fetchImpl).chain.getConfig();
    expect(result).toEqual({ HAHA: 1 });
    expect(calls[0]).toBe('https://sds0.steemworld.org/chain_api/getConfig');
  });

  it('encodes positional arguments into the route', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok([]));
    await client(fetchImpl).chain.getAccountNamesByPrefix('al', 50);
    expect(calls[0]).toBe('https://sds0.steemworld.org/chain_api/getAccountNamesByPrefix/al/50');
  });

  it('builds range routes as from-to', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok([]));
    await client(fetchImpl).blocks.getBlocksInRange(1, 5);
    expect(calls[0]).toBe('https://sds0.steemworld.org/blocks_api/getBlocksInRange/1-5');
  });

  it('builds CSV parameters as comma separated values', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok({}));
    await client(fetchImpl).posts.getPost('alice', 'hello', undefined, undefined, ['title', 'body']);
    expect(calls[0]).toBe(
      'https://sds0.steemworld.org/posts_api/getPost/alice/hello/true/null/title%2Cbody',
    );
  });

  it('URL encodes segments that contain reserved characters', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok([]));
    await client(fetchImpl).chain.getAccountNamesByPrefix('a b/c');
    expect(calls[0]).toContain('a%20b%2Fc');
  });

  it('supports object style arguments', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok([]));
    await client(fetchImpl).chain.getAccountNames({ limit: 7 });
    expect(calls[0]).toBe('https://sds0.steemworld.org/chain_api/getAccountNames/7');
  });
});

describe('envelope handling', () => {
  it('unwraps { code: 0, result }', async () => {
    const { fetchImpl } = mockFetch(() => ok([1, 2, 3]));
    await expect(client(fetchImpl).chain.getAccountNames()).resolves.toEqual([1, 2, 3]);
  });

  it('throws SDSApiError for { code: -1, error }', async () => {
    const { fetchImpl } = mockFetch(() => envelope(-1, 'bad request'));
    const error = await client(fetchImpl).chain.getConfig().catch((e) => e);
    expect(error).toBeInstanceOf(SDSApiError);
    expect(isSDSError(error)).toBe(true);
    expect(error.code).toBe('ERR_SDS_API');
    expect(error.apiCode).toBe(-1);
    expect(error.errorMessage).toBe('bad request');
    expect(error.module).toBe('chain_api');
    expect(error.method).toBe('getConfig');
    expect(error.url).toContain('/chain_api/getConfig');
  });

  it('throws SDSHttpError for HTML error pages (unknown route)', async () => {
    const { fetchImpl } = mockFetch(() => html(404));
    const error = await client(fetchImpl).chain.getConfig().catch((e) => e);
    expect(error).toBeInstanceOf(SDSHttpError);
    expect(error.status).toBe(404);
    expect(error.body).toContain('not found');
  });

  it('throws SDSResponseError for a 200 with an unexpected body', async () => {
    const { fetchImpl } = mockFetch(() => new Response('hello', { status: 200 }));
    const error = await client(fetchImpl).chain.getConfig().catch((e) => e);
    expect(error).toBeInstanceOf(SDSResponseError);
    expect(error.body).toBe('hello');
  });
});

describe('retries', () => {
  it('retries network failures up to `retries` times', async () => {
    let attempts = 0;
    const fetchImpl: FetchLike = async () => {
      attempts++;
      throw new TypeError('fetch failed');
    };
    const sds = client(fetchImpl, { retries: 2, retryDelay: 1 });
    await expect(sds.chain.getConfig()).rejects.toThrowError(/fetch failed/);
    expect(attempts).toBe(3);
  });

  it('retries HTTP 5xx then succeeds', async () => {
    let attempts = 0;
    const fetchImpl: FetchLike = async () => {
      attempts++;
      return attempts < 3 ? html(502, 'bad gateway') : ok({ ok: true });
    };
    const sds = client(fetchImpl, { retries: 3, retryDelay: 1 });
    await expect(sds.chain.getConfig()).resolves.toEqual({ ok: true });
    expect(attempts).toBe(3);
  });

  it('does not retry application errors', async () => {
    let attempts = 0;
    const fetchImpl: FetchLike = async () => {
      attempts++;
      return envelope(-1, 'nope');
    };
    await expect(client(fetchImpl, { retries: 3 }).chain.getConfig()).rejects.toBeInstanceOf(
      SDSApiError,
    );
    expect(attempts).toBe(1);
  });

  it('honours per call retries', async () => {
    let attempts = 0;
    const fetchImpl: FetchLike = async () => {
      attempts++;
      throw new TypeError('fetch failed');
    };
    const sds = client(fetchImpl, { retries: 0, retryDelay: 0 });
    await expect(sds.call('chain_api', 'getConfig', null, { retries: 2 })).rejects.toThrow();
    expect(attempts).toBe(3);
  });
});

describe('timeout and abort', () => {
  it('fails with SDSTimeoutError when the server never answers', async () => {
    const fetchImpl: FetchLike = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        });
      });
    const sds = client(fetchImpl, { timeout: 20, retries: 0 });
    const error = await sds.chain.getConfig().catch((e) => e);
    expect(error).toBeInstanceOf(SDSTimeoutError);
    expect(error.timeout).toBe(20);
    expect(error.code).toBe('ERR_SDS_TIMEOUT');
  });

  it('fails with an abort error when the external signal fires', async () => {
    const fetchImpl: FetchLike = (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        });
      });
    const controller = new AbortController();
    const sds = client(fetchImpl, { timeout: 0, retries: 0 });
    const promise = sds.call('chain_api', 'getConfig', null, { signal: controller.signal });
    controller.abort();
    const error = await promise.catch((e) => e);
    expect(error.code).toBe('ERR_SDS_ABORT');
  });
});

describe('callbacks', () => {
  it('delivers (null, result) on success', async () => {
    const { fetchImpl } = mockFetch(() => ok(['alice']));
    await new Promise<void>((resolve, reject) => {
      client(fetchImpl)
        .chain.getAccountNames((error, result) => {
          try {
            expect(error).toBeNull();
            expect(result).toEqual(['alice']);
            resolve();
          } catch (assertion) {
            reject(assertion);
          }
        })
        .catch(reject);
    });
  });

  it('delivers (error) on failure and resolves the returned promise with undefined', async () => {
    const { fetchImpl } = mockFetch(() => envelope(-1, 'boom'));
    const returned = await client(fetchImpl).chain.getConfig((error, result) => {
      expect(error).toBeInstanceOf(SDSApiError);
      expect(error?.message).toContain('boom');
      expect(result).toBeUndefined();
    });
    expect(returned).toBeUndefined();
  });

  it('supports the generic call() with a callback', async () => {
    const { fetchImpl } = mockFetch(() => ok(42));
    await new Promise<void>((resolve, reject) => {
      client(fetchImpl)
        .call('chain_api', 'getConfig', null, (error, result) => {
          if (error) reject(error);
          else {
            expect(result).toBe(42);
            resolve();
          }
        })
        .catch(reject);
    });
  });

  it('passes validation errors to the callback instead of throwing', async () => {
    const { fetchImpl } = mockFetch(() => ok(null));
    await new Promise<void>((resolve, reject) => {
      client(fetchImpl)
        // @ts-expect-error deliberately invalid argument to exercise validation
        .chain.getAccountNames(-5, (error) => {
          try {
            expect(error?.code).toBe('ERR_SDS_VALIDATION');
            resolve();
          } catch (assertion) {
            reject(assertion);
          }
        })
        .catch(reject);
    });
  });
});

describe('generic entry points', () => {
  it('call() with an array of params', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok([]));
    await client(fetchImpl).call('chain_api', 'getAccountNames', [5]);
    expect(calls[0]).toContain('/chain_api/getAccountNames/5');
  });

  it('call() forwards unknown methods as raw segments', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok({ x: 1 }));
    const result = await client(fetchImpl).call('brand_new_api', 'getThing', [1, 'a b']);
    expect(result).toEqual({ x: 1 });
    expect(calls[0]).toBe('https://sds0.steemworld.org/brand_new_api/getThing/1/a%20b');
  });

  it('call() accepts call options (timeout / headers)', async () => {
    let seenHeaders: Headers | undefined;
    const fetchImpl: FetchLike = async (_url, init) => {
      seenHeaders = new Headers(init?.headers);
      return ok(null);
    };
    await client(fetchImpl).call('chain_api', 'getConfig', null, {
      headers: { 'x-test': 'yes' },
    });
    expect(seenHeaders?.get('x-test')).toBe('yes');
  });

  it('request() performs a raw GET and unwraps the envelope', async () => {
    const { calls, fetchImpl } = mockFetch(() => ok('raw'));
    expect(await client(fetchImpl).request('/chain_api/getConfig')).toBe('raw');
    expect(calls[0]).toBe('https://sds0.steemworld.org/chain_api/getConfig');
    // missing leading slash is fixed
    await client(fetchImpl).request('system_api/getVersion');
    expect(calls[1]).toBe('https://sds0.steemworld.org/system_api/getVersion');
  });

  it('request() supports callbacks', async () => {
    const { fetchImpl } = mockFetch(() => ok('v1'));
    await new Promise<void>((resolve, reject) => {
      client(fetchImpl)
        .request('/system_api/getVersion', (error, result) => {
          if (error) reject(error);
          else {
            expect(result).toBe('v1');
            resolve();
          }
        })
        .catch(reject);
    });
  });
});

describe('options', () => {
  it('merges client headers into every request', async () => {
    let seen: Headers | undefined;
    const fetchImpl: FetchLike = async (_url, init) => {
      seen = new Headers(init?.headers);
      return ok(null);
    };
    await new SDS({ fetch: fetchImpl, headers: { 'x-api-key': 'k' } }).chain.getConfig();
    expect(seen?.get('x-api-key')).toBe('k');
  });

  it('withOptions() creates a derived client with merged options', () => {
    const base = new SDS({ fetch: async () => ok(null), headers: { a: '1' }, timeout: 1000 });
    const derived = base.withOptions({ headers: { b: '2' }, timeout: 50 });
    expect(derived.baseUrl).toBe(base.baseUrl);
    expect(derived.options.timeout).toBe(50);
    expect(derived.options.headers).toEqual({ a: '1', b: '2' });
    expect(base.options.timeout).toBe(1000);
  });

  it('toOptions() round-trips the instance', () => {
    const sds = new SDS({ instance: 'sds1', fetch: async () => ok(null) });
    const clone = new SDS(sds.toOptions());
    expect(clone.baseUrl).toBe(sds.baseUrl);
  });

  it('createSDS mirrors the constructor', () => {
    const sds = createSDS({ instance: 'sds1', fetch: async () => ok(null) });
    expect(sds).toBeInstanceOf(SDS);
    expect(sds.instance).toBe('sds1');
  });

  it('hooks observe requests and responses', async () => {
    const onRequest = vi.fn();
    const onResponse = vi.fn();
    const { fetchImpl } = mockFetch(() => ok(null));
    await new SDS({ fetch: fetchImpl, retries: 0, onRequest, onResponse }).chain.getConfig();
    expect(onRequest).toHaveBeenCalledTimes(1);
    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(onRequest.mock.calls[0][0]).toMatchObject({
      module: 'chain_api',
      method: 'getConfig',
      attempt: 1,
    });
    expect(onResponse.mock.calls[0][0]).toMatchObject({ ok: true, status: 200 });
  });

  it('hook exceptions never break a call', async () => {
    const { fetchImpl } = mockFetch(() => ok('fine'));
    const sds = new SDS({
      fetch: fetchImpl,
      retries: 0,
      onRequest: () => {
        throw new Error('hook boom');
      },
      onResponse: () => {
        throw new Error('hook boom');
      },
    });
    await expect(sds.chain.getConfig()).resolves.toBe('fine');
  });

  it('a throwing callback surfaces as an uncaught exception', async () => {
    const { fetchImpl } = mockFetch(() => ok(null));
    const queueMicrotaskSpy = vi.spyOn(globalThis, 'queueMicrotask');
    const rethrow = vi.fn();
    queueMicrotaskSpy.mockImplementation((cb) => {
      try {
        cb();
      } catch (error) {
        rethrow(error);
      }
    });
    try {
      await client(fetchImpl).chain.getConfig(() => {
        throw new Error('callback boom');
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(rethrow).toHaveBeenCalledWith(expect.objectContaining({ message: 'callback boom' }));
    } finally {
      queueMicrotaskSpy.mockRestore();
    }
  });
});

describe('client shape', () => {
  it('exposes every module namespace', () => {
    const sds = new SDS({ fetch: async () => ok(null) });
    for (const key of [
      'blocks',
      'chain',
      'steemRequests',
      'transactions',
      'accounts',
      'accountHistory',
      'authorities',
      'delegations',
      'followers',
      'mentions',
      'notifications',
      'rewards',
      'transfers',
      'witnesses',
      'communities',
      'contentHistory',
      'contentSearch',
      'feeds',
      'posts',
      'postResteems',
      'postTags',
      'system',
    ]) {
      expect(sds[key as keyof SDS]).toBeDefined();
    }
  });

  it('module() resolves namespaces by module id and rejects unknown ids', () => {
    const sds = new SDS({ fetch: async () => ok(null) });
    expect(sds.module('chain_api')).toBe(sds.chain);
    expect(() => sds.module('nope_api')).toThrowError(/Unknown SDS module/);
  });

  it('rejects invalid object args with SDSArgumentError', async () => {
    const sds = new SDS({ fetch: async () => ok(null) });
    // @ts-expect-error deliberately unknown parameter name
    await expect(sds.chain.getAccountNames({ nope: 1 })).rejects.toThrowError(/Unknown parameter/);
  });
});
