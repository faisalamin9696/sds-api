/**
 * Public types of `@steempro/sds-api`.
 */
import type { SDSError } from './errors';

/**
 * Node-style callback used by every method of the library.
 *
 * - on success: `callback(null, result)`
 * - on failure: `callback(error)` (the result is `undefined`)
 */
export type Callback<T = any> = (error: SDSError | null, result?: T) => void;

/** Minimal `fetch` contract accepted by the client (Node 18+, Deno, Bun, browsers). */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** Map of instance name → base URL, e.g. `{ sds0: 'https://sds0.steemworld.org' }`. */
export type SDSInstanceMap = Record<string, string>;

/** Information passed to {@link SDSOptions.onRequest}. */
export interface SDSRequestInfo {
  /** Absolute URL of the request. */
  url: string;
  /** Base URL of the SDS instance. */
  baseUrl: string;
  /** SDS module of the call, when known (e.g. `chain_api`). */
  module?: string;
  /** SDS method of the call, when known (e.g. `getAccountNames`). */
  method?: string;
  /** 1‑based attempt counter (incremented by retries). */
  attempt: number;
}

/** Information passed to {@link SDSOptions.onResponse}. */
export interface SDSResponseInfo extends SDSRequestInfo {
  /** HTTP status code (`0` when the request never completed). */
  status: number;
  /** Duration of the attempt in milliseconds. */
  durationMs: number;
  /** `true` when the SDS payload was successfully unwrapped. */
  ok: boolean;
  /** Error that made the call fail, when it failed. */
  error?: SDSError;
}

/** Construction options of {@link SDS}. */
export interface SDSOptions {
  /**
   * Name of the SDS instance to use: `sds0` (default), `sds1`, `sds`, or any
   * name registered through {@link SDSOptions.instances} / `SDS.registerInstance()`.
   * A full URL (`https://sds9.example.org`) is accepted as well.
   */
  instance?: string;
  /** Full base URL of the SDS instance. Takes precedence over `instance`. */
  baseUrl?: string;
  /** Extra instance names available to this client. */
  instances?: SDSInstanceMap;
  /** Request timeout in milliseconds (`0` disables it). Default `30000`. */
  timeout?: number;
  /** Retries for network / timeout / 5xx / 429 failures. Default `2`. */
  retries?: number;
  /** Base delay in ms for the exponential backoff. Default `300`. */
  retryDelay?: number;
  /** Extra HTTP headers sent with every request. */
  headers?: Record<string, string>;
  /** Custom `fetch` implementation (tests, proxies, Node < 18 polyfills). */
  fetch?: FetchLike;
  /** Client side parameter validation. Default `true`. */
  validate?: boolean;
  /** URL‑encode path segments. Default `true`. */
  encode?: boolean;
  /** Called before every attempt (logging / tracing). */
  onRequest?: (info: SDSRequestInfo) => void;
  /** Called after every attempt, successful or not (logging / tracing). */
  onResponse?: (info: SDSResponseInfo) => void;
}

/** Options accepted by the generic {@link SDS.call} / {@link SDS.request} entry points. */
export interface SDSCallOptions {
  /** Overrides the client timeout for this call. */
  timeout?: number;
  /** Overrides the client retry count for this call. */
  retries?: number;
  /** Overrides the client backoff delay for this call. */
  retryDelay?: number;
  /** Extra headers for this call (merged with the client headers). */
  headers?: Record<string, string>;
  /** Abort the call from the outside. */
  signal?: AbortSignal;
  /** Overrides client side validation for this call. */
  validate?: boolean;
}

/** Options with every default applied (returned by {@link SDS.options}). */
export interface ResolvedSDSOptions
  extends Required<
    Pick<
      SDSOptions,
      'timeout' | 'retries' | 'retryDelay' | 'validate' | 'encode'
    >
  > {
  instance?: string;
  baseUrl: string;
  instances: SDSInstanceMap;
  headers: Record<string, string>;
  fetch: FetchLike;
  onRequest?: (info: SDSRequestInfo) => void;
  onResponse?: (info: SDSResponseInfo) => void;
}
