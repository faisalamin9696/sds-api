/**
 * HTTP layer: performs the request, maps every failure mode onto the
 * {@link SDSError} hierarchy, unwraps the `{ code, result, error }` envelope
 * and adapts promises to node-style callbacks.
 */
import {
  SDSAbortError,
  SDSApiError,
  SDSError,
  SDSHttpError,
  SDSNetworkError,
  SDSResponseError,
  SDSTimeoutError,
  toSDSError,
} from '../errors';
import type {
  Callback,
  FetchLike,
  ResolvedSDSOptions,
  SDSCallOptions,
  SDSRequestInfo,
  SDSResponseInfo,
} from '../types';

/** Target of a request: an absolute, already encoded path such as `/chain_api/getConfig`. */
export interface InvokeTarget {
  path: string;
  module?: string;
  method?: string;
}

/** Performs a GET against the configured SDS instance and returns the unwrapped `result`. */
export async function invoke(
  options: ResolvedSDSOptions,
  target: InvokeTarget,
  callOptions: SDSCallOptions = {},
): Promise<any> {
  const url = `${options.baseUrl}${target.path}`;
  const timeout = callOptions.timeout ?? options.timeout;
  const retries = callOptions.retries ?? options.retries;
  const headers: Record<string, string> = { ...options.headers, ...callOptions.headers };
  const context = { module: target.module, method: target.method, url };

  let lastError: SDSError | undefined;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const requestInfo: SDSRequestInfo = {
      url,
      baseUrl: options.baseUrl,
      module: target.module,
      method: target.method,
      attempt,
    };
    const startedAt = Date.now();

    try {
      options.onRequest?.(requestInfo);
    } catch {
      /* hooks must never break a call */
    }

    try {
      const { status, body } = await performFetch(options.fetch, url, headers, timeout, callOptions.signal, context);
      const result = unwrap(status, body, context);
      notifyResponse(options, {
        ...requestInfo,
        status,
        durationMs: Date.now() - startedAt,
        ok: true,
      });
      return result;
    } catch (caught) {
      const error = toSDSError(caught, context);
      lastError = error;
      notifyResponse(options, {
        ...requestInfo,
        status: statusOf(error),
        durationMs: Date.now() - startedAt,
        ok: false,
        error,
      });

      if (attempt <= retries && isRetryable(error)) {
        await delay(retryDelayOf(options, callOptions, attempt));
        continue;
      }
      throw error;
    }
  }

  /* istanbul ignore next -- the loop always returns or throws */
  throw lastError ?? new SDSNetworkError('Request failed', context);
}

/**
 * Adapts a promise to a node-style callback.
 *
 * Without a callback the promise is returned untouched. With a callback the
 * result/error is delivered to it and a promise resolving to `undefined` is
 * returned (so callback style never causes unhandled rejections).
 */
export function settle<T>(promise: Promise<T>, callback?: Callback<T>): Promise<T | void> {
  if (!callback) return promise;

  promise.then(
    (value) => deliver(callback, null, value),
    (error) => deliver(callback, toSDSError(error)),
  );
  return Promise.resolve(undefined);
}

/* ------------------------------------------------------------------ */
/* internals                                                           */
/* ------------------------------------------------------------------ */

function deliver(callback: Callback<any>, error: SDSError | null, value?: unknown): void {
  try {
    if (error === null) callback(null, value);
    else callback(error);
  } catch (thrown) {
    // Mirror plain callback code: a throwing callback surfaces as an
    // uncaught exception instead of being swallowed by the library.
    queueMicrotask(() => {
      throw thrown;
    });
  }
}

async function performFetch(
  fetchImpl: FetchLike,
  url: string,
  headers: Record<string, string>,
  timeout: number,
  externalSignal: AbortSignal | undefined,
  context: { module?: string; method?: string; url: string },
): Promise<{ status: number; body: string }> {
  const controller = new AbortController();
  let timedOut = false;
  let aborted = false;

  const timer =
    timeout > 0
      ? setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, timeout)
      : undefined;

  const onExternalAbort = (): void => {
    aborted = true;
    controller.abort();
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      if (timer) clearTimeout(timer);
      throw new SDSAbortError(context);
    }
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    const body = await response.text();
    return { status: response.status, body };
  } catch (error) {
    if (error instanceof SDSError) throw error;
    if (timedOut) throw new SDSTimeoutError(timeout, context);
    if (aborted) throw new SDSAbortError(context);
    const message = error instanceof Error ? error.message : String(error);
    throw new SDSNetworkError(`Request to ${url} failed: ${message}`, context, { cause: error });
  } finally {
    if (timer) clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}

/** Turns the SDS response into the `result` payload or throws a typed error. */
function unwrap(
  status: number,
  body: string,
  context: { module?: string; method?: string; url: string },
): unknown {
  const trimmed = body.trim();
  let parsed: unknown = null;
  if (trimmed) {
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      parsed = null;
    }
  }

  const envelope =
    parsed && typeof parsed === 'object' && 'code' in (parsed as Record<string, unknown>)
      ? (parsed as { code: number; result?: unknown; error?: unknown })
      : null;

  const okStatus = status >= 200 && status < 300;

  if (envelope) {
    if (envelope.code === 0) {
      if (!okStatus) {
        throw new SDSHttpError(status, trimmed.slice(0, 2000), context);
      }
      return envelope.result;
    }
    throw new SDSApiError(
      Number(envelope.code),
      typeof envelope.error === 'string' ? envelope.error : 'Unknown SDS error',
      context,
    );
  }

  if (!okStatus) {
    throw new SDSHttpError(status, trimmed.slice(0, 2000), context);
  }

  throw new SDSResponseError(
    `SDS returned an unexpected payload for ${context.url}`,
    trimmed.slice(0, 2000),
    context,
  );
}

function isRetryable(error: SDSError): boolean {
  if (error instanceof SDSNetworkError || error instanceof SDSTimeoutError) return true;
  if (error instanceof SDSHttpError) return error.status >= 500 || error.status === 429;
  return false;
}

function statusOf(error: SDSError): number {
  if (error instanceof SDSHttpError) return error.status;
  if (error instanceof SDSApiError) return 200;
  return 0;
}

function retryDelayOf(
  options: ResolvedSDSOptions,
  callOptions: SDSCallOptions,
  attempt: number,
): number {
  const base = callOptions.retryDelay ?? options.retryDelay;
  if (base <= 0) return 0;
  return base * 2 ** (attempt - 1);
}

function notifyResponse(options: ResolvedSDSOptions, info: SDSResponseInfo): void {
  try {
    options.onResponse?.(info);
  } catch {
    /* hooks must never break a call */
  }
}

const delay = (ms: number): Promise<void> =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
