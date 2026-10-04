/**
 * Error hierarchy of `@steempro/sds`.
 *
 * Every error produced by the library extends {@link SDSError} and carries a
 * stable machine readable `code`, plus the `module`, `method` and `url` of the
 * call that produced it (when available), so failures can be classified with a
 * simple `switch (error.code)`.
 */

/** Stable, machine readable error codes. */
export type SDSErrorCode =
  | 'ERR_SDS_VALIDATION'
  | 'ERR_SDS_ARGUMENT'
  | 'ERR_SDS_NETWORK'
  | 'ERR_SDS_TIMEOUT'
  | 'ERR_SDS_ABORT'
  | 'ERR_SDS_HTTP'
  | 'ERR_SDS_RESPONSE'
  | 'ERR_SDS_API';

/** Context attached to every error. */
export interface SDSErrorContext {
  /** SDS module of the failing call, e.g. `chain_api`. */
  module?: string;
  /** SDS method of the failing call, e.g. `getAccountNames`. */
  method?: string;
  /** Absolute URL of the failing request. */
  url?: string;
}

/** JSON representation of an error (useful for logging). */
export interface SDSErrorJSON {
  name: string;
  code: SDSErrorCode | string;
  message: string;
  module?: string;
  method?: string;
  url?: string;
}

/** Base class of every error thrown by this library. */
export class SDSError extends Error {
  /** Stable machine readable code, e.g. `ERR_SDS_API`. */
  readonly code: SDSErrorCode | string;
  /** SDS module of the failing call (e.g. `chain_api`), when known. */
  readonly module?: string;
  /** SDS method of the failing call (e.g. `getAccountNames`), when known. */
  readonly method?: string;
  /** Absolute URL of the failing request, when known. */
  readonly url?: string;

  constructor(
    message: string,
    code: SDSErrorCode,
    context: SDSErrorContext = {},
    options?: { cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'SDSError';
    this.code = code;
    this.module = context.module;
    this.method = context.method;
    this.url = context.url;
    Object.setPrototypeOf(this, new.target.prototype);
    if (typeof (Error as { captureStackTrace?: unknown }).captureStackTrace === 'function') {
      (Error as unknown as {
        captureStackTrace: (target: object, ctor?: unknown) => void;
      }).captureStackTrace(this, new.target);
    }
  }

  /** Structured representation, safe to serialize. */
  toJSON(): SDSErrorJSON {
    const json: SDSErrorJSON = { name: this.name, code: this.code, message: this.message };
    if (this.module) json.module = this.module;
    if (this.method) json.method = this.method;
    if (this.url) json.url = this.url;
    return json;
  }
}

/** A parameter failed client side validation (type, range, allowed value, missing, …). */
export class SDSValidationError extends SDSError {
  /** Name of the offending parameter. */
  readonly param?: string;
  /** Human readable expectation, e.g. `integer between 1 and 10000`. */
  readonly expected?: string;
  /** Offending value. */
  readonly value?: unknown;

  constructor(
    message: string,
    context: SDSErrorContext & { param?: string; expected?: string; value?: unknown } = {},
  ) {
    const { param, expected, value, ...rest } = context;
    super(message, 'ERR_SDS_VALIDATION', rest);
    this.name = 'SDSValidationError';
    this.param = param;
    this.expected = expected;
    this.value = value;
  }
}

/** The library was called incorrectly (unknown module/method, wrong arity, unknown object key, …). */
export class SDSArgumentError extends SDSError {
  constructor(message: string, context: SDSErrorContext = {}, options?: { cause?: unknown }) {
    super(message, 'ERR_SDS_ARGUMENT', context, options);
    this.name = 'SDSArgumentError';
  }
}

/** The request never reached SDS (DNS failure, connection reset, CORS, offline, …). */
export class SDSNetworkError extends SDSError {
  constructor(message: string, context: SDSErrorContext = {}, options?: { cause?: unknown }) {
    super(message, 'ERR_SDS_NETWORK', context, options);
    this.name = 'SDSNetworkError';
  }
}

/** The request exceeded the configured timeout. */
export class SDSTimeoutError extends SDSError {
  /** Configured timeout in milliseconds. */
  readonly timeout: number;

  constructor(timeout: number, context: SDSErrorContext = {}) {
    super(`Request timed out after ${timeout}ms`, 'ERR_SDS_TIMEOUT', context);
    this.name = 'SDSTimeoutError';
    this.timeout = timeout;
  }
}

/** The request was aborted through an `AbortSignal`. */
export class SDSAbortError extends SDSError {
  constructor(context: SDSErrorContext = {}) {
    super('Request was aborted', 'ERR_SDS_ABORT', context);
    this.name = 'SDSAbortError';
  }
}

/** SDS answered with a non-success HTTP status (e.g. `404` for an unknown route). */
export class SDSHttpError extends SDSError {
  /** HTTP status code. */
  readonly status: number;
  /** Raw response body (truncated). */
  readonly body: string;

  constructor(status: number, body: string, context: SDSErrorContext = {}) {
    super(
      `SDS responded with HTTP ${status}${body ? `: ${truncate(body, 200)}` : ''}`,
      'ERR_SDS_HTTP',
      context,
    );
    this.name = 'SDSHttpError';
    this.status = status;
    this.body = body;
  }
}

/** SDS answered `200` but the body was not the expected JSON envelope. */
export class SDSResponseError extends SDSError {
  /** Raw response body (truncated). */
  readonly body: string;

  constructor(message: string, body: string, context: SDSErrorContext = {}) {
    super(message, 'ERR_SDS_RESPONSE', context);
    this.name = 'SDSResponseError';
    this.body = body;
  }
}

/** SDS answered with an application level error: `{ code: <non zero>, error: "…" }`. */
export class SDSApiError extends SDSError {
  /** The `code` field returned by SDS (e.g. `-1`). */
  readonly apiCode: number;
  /** The `error` message returned by SDS. */
  readonly errorMessage: string;

  constructor(apiCode: number, errorMessage: string, context: SDSErrorContext = {}) {
    const where = context.module && context.method ? ` (${context.module}.${context.method})` : '';
    super(`SDS returned code ${apiCode}: ${errorMessage}${where}`, 'ERR_SDS_API', context);
    this.name = 'SDSApiError';
    this.apiCode = apiCode;
    this.errorMessage = errorMessage;
  }
}

/** Type guard for {@link SDSError}. */
export function isSDSError(value: unknown): value is SDSError {
  return value instanceof SDSError;
}

/** Wraps unknown thrown values so callbacks always receive an {@link SDSError}. */
export function toSDSError(value: unknown, context: SDSErrorContext = {}): SDSError {
  if (isSDSError(value)) return value;
  if (value instanceof Error) {
    const error = new SDSError(value.message, 'ERR_SDS_ARGUMENT', context, { cause: value });
    error.name = 'SDSError';
    return error;
  }
  return new SDSError(String(value), 'ERR_SDS_ARGUMENT', context, { cause: value });
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
