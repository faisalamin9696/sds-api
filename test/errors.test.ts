import { describe, expect, it } from 'vitest';
import {
  SDSAbortError,
  SDSApiError,
  SDSArgumentError,
  SDSError,
  SDSHttpError,
  SDSNetworkError,
  SDSResponseError,
  SDSValidationError,
  SDSTimeoutError,
  isSDSError,
  toSDSError,
} from '../src/errors';

describe('error hierarchy', () => {
  it('every error extends SDSError and carries a stable code', () => {
    const cases: Array<[SDSError, string]> = [
      [new SDSValidationError('m'), 'ERR_SDS_VALIDATION'],
      [new SDSArgumentError('m'), 'ERR_SDS_ARGUMENT'],
      [new SDSNetworkError('m'), 'ERR_SDS_NETWORK'],
      [new SDSTimeoutError(1000), 'ERR_SDS_TIMEOUT'],
      [new SDSAbortError(), 'ERR_SDS_ABORT'],
      [new SDSHttpError(500, 'oops'), 'ERR_SDS_HTTP'],
      [new SDSResponseError('m', 'body'), 'ERR_SDS_RESPONSE'],
      [new SDSApiError(-1, 'bad'), 'ERR_SDS_API'],
    ];
    for (const [error, code] of cases) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(SDSError);
      expect(error.code).toBe(code);
      expect(isSDSError(error)).toBe(true);
      expect(error.name).toBe(error.constructor.name);
    }
  });

  it('isinstance checks work across instanceof (prototype fixed)', () => {
    expect(new SDSApiError(-1, 'x')).toBeInstanceOf(SDSError);
    expect(new SDSTimeoutError(5)).toBeInstanceOf(SDSError);
  });
});

describe('error context and serialization', () => {
  it('keeps module, method and url', () => {
    const error = new SDSApiError(-1, 'bad', {
      module: 'chain_api',
      method: 'getConfig',
      url: 'https://sds0.steemworld.org/chain_api/getConfig',
    });
    expect(error.module).toBe('chain_api');
    expect(error.method).toBe('getConfig');
    expect(error.url).toContain('/chain_api/getConfig');
    expect(error.message).toContain('chain_api.getConfig');
    expect(error.toJSON()).toEqual({
      name: 'SDSApiError',
      code: 'ERR_SDS_API',
      message: error.message,
      module: 'chain_api',
      method: 'getConfig',
      url: error.url,
    });
  });

  it('toJSON omits missing context', () => {
    expect(new SDSArgumentError('x').toJSON()).toEqual({
      name: 'SDSArgumentError',
      code: 'ERR_SDS_ARGUMENT',
      message: 'x',
    });
  });

  it('keeps subclass specific fields', () => {
    expect(new SDSTimeoutError(1234).timeout).toBe(1234);
    expect(new SDSHttpError(404, '<html/>').status).toBe(404);
    expect(new SDSHttpError(404, 'x'.repeat(500)).body.length).toBeLessThanOrEqual(2001);
    const api = new SDSApiError(-1, 'boom');
    expect(api.apiCode).toBe(-1);
    expect(api.errorMessage).toBe('boom');
    const validation = new SDSValidationError('bad', {
      param: 'limit',
      expected: 'integer',
      value: 'abc',
    });
    expect(validation.param).toBe('limit');
    expect(validation.expected).toBe('integer');
    expect(validation.value).toBe('abc');
    expect(new SDSHttpError(500, 'long'.repeat(200)).message).toContain('HTTP 500');
  });
});

describe('toSDSError', () => {
  it('returns SDSError instances untouched', () => {
    const original = new SDSNetworkError('x');
    expect(toSDSError(original)).toBe(original);
  });

  it('wraps plain errors with the cause attached', () => {
    const cause = new Error('boom');
    const wrapped = toSDSError(cause, { module: 'chain_api' });
    expect(wrapped).toBeInstanceOf(SDSError);
    expect(wrapped.message).toBe('boom');
    expect(wrapped.cause).toBe(cause);
    expect(wrapped.module).toBe('chain_api');
  });

  it('wraps non error values', () => {
    const wrapped = toSDSError('just a string');
    expect(wrapped).toBeInstanceOf(SDSError);
    expect(wrapped.message).toBe('just a string');
  });
});
