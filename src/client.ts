/**
 * The SDS client.
 *
 * ```ts
 * import { SDS } from '@steempro/sds-api';
 *
 * const sds = new SDS({ instance: 'sds0' });       // https://sds0.steemworld.org
 * const info = await sds.chain.getChainStats();    // promise style
 * sds.chain.getChainStats((err, info) => { … });   // callback style
 * ```
 */
import { SDSArgumentError } from './errors';
import { basicFormat, buildPath, resolveSegments, splitCallback } from './core/params';
import { invoke, settle } from './core/invoke';
import { findMethod, getModule, listMethods, listModules } from './meta';
import { SDS_REFERENCE_SOURCE, SDS_REFERENCE_VERSION } from './generated/meta';
import type { SDSMethodMeta, SDSModuleMeta } from './meta-types';
import type { SDSModuleKeys, SDSModules } from './generated/types';
import type {
  Callback,
  SDSInstanceMap,
  SDSOptions,
  ResolvedSDSOptions,
  SDSCallOptions,
} from './types';

/** Instances bundled with the library. */
export const DEFAULT_SDS_INSTANCES: Readonly<SDSInstanceMap> = Object.freeze({
  sds: 'https://sds.steemworld.org',
  sds0: 'https://sds0.steemworld.org',
  sds1: 'https://sds1.steemworld.org',
});

const customInstances: SDSInstanceMap = {};

/**
 * Registers an additional SDS instance name for the whole process
 * (e.g. `registerInstance('sds9', 'https://sds9.example.org')`).
 *
 * Per client instances can also be passed with `new SDS({ instances: { … } })`.
 */
export function registerInstance(name: string, url: string): void {
  if (!name || /\s/.test(name)) {
    throw new SDSArgumentError(`Invalid instance name ${JSON.stringify(name)}`);
  }
  if (!/^https?:\/\//i.test(url)) {
    throw new SDSArgumentError(`Instance "${name}" must be an http(s) URL, got ${JSON.stringify(url)}`);
  }
  customInstances[name] = trimSlash(url);
}

/** Every instance known to the library (defaults + {@link registerInstance}). */
export function listInstances(): SDSInstanceMap {
  return { ...DEFAULT_SDS_INSTANCES, ...customInstances };
}

/** Factory mirroring `new SDS(options)`. */
export function createSDS(options: SDSOptions = {}): SDS {
  return new SDS(options);
}

const trimSlash = (url: string): string => url.replace(/\/+$/, '');
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const CALL_OPTION_KEYS = new Set(['timeout', 'retries', 'retryDelay', 'headers', 'signal', 'validate']);

interface ResolvedCallArgs {
  params?: readonly unknown[];
  options: SDSCallOptions;
  callback?: Callback<any>;
}

function resolveOptions(options: SDSOptions): ResolvedSDSOptions {
  const instances: SDSInstanceMap = {
    ...DEFAULT_SDS_INSTANCES,
    ...customInstances,
    ...options.instances,
  };

  let instance = options.instance;
  let baseUrl = options.baseUrl ? trimSlash(options.baseUrl) : '';

  if (!baseUrl) {
    const name = instance ?? 'sds0';
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(name)) {
      baseUrl = trimSlash(name);
      instance = name;
    } else {
      const resolved = instances[name];
      if (!resolved) {
        throw new SDSArgumentError(
          `Unknown SDS instance "${name}". Known instances: ${Object.keys(instances).join(', ')}. ` +
            `Pass { baseUrl: 'https://…' } or { instances: { ${name}: 'https://…' } } to use your own SDS instance.`,
        );
      }
      baseUrl = trimSlash(resolved);
      instance = name;
    }
  } else {
    instance = instance ?? baseUrl;
  }

  const fetchImpl =
    options.fetch ??
    (typeof globalThis.fetch === 'function' ? (globalThis.fetch as typeof fetch).bind(globalThis) : undefined);
  if (!fetchImpl) {
    throw new SDSArgumentError(
      'No fetch implementation found. Use Node.js 18+, Deno, Bun or a browser, or pass { fetch }.',
    );
  }

  return {
    instance,
    baseUrl,
    instances,
    timeout: options.timeout ?? 30_000,
    retries: options.retries ?? 2,
    retryDelay: options.retryDelay ?? 300,
    headers: { ...options.headers },
    fetch: fetchImpl,
    validate: options.validate ?? true,
    encode: options.encode ?? true,
    onRequest: options.onRequest,
    onResponse: options.onResponse,
  };
}

/** Splits the `(params?, options?, callback?)` tail of the generic entry points. */
function resolveCallArgs(
  first: unknown,
  second: unknown,
  third: unknown,
): ResolvedCallArgs {
  const resolved: ResolvedCallArgs = { options: {} };

  const isOptionsObject = (value: unknown): value is SDSCallOptions =>
    isPlainObject(value) &&
    Object.keys(value).length > 0 &&
    Object.keys(value).every((key) => CALL_OPTION_KEYS.has(key));

  if (typeof first === 'function') {
    resolved.callback = first as Callback<any>;
  } else if (first !== undefined && first !== null) {
    if (Array.isArray(first)) resolved.params = first;
    else if (!isOptionsObject(first)) resolved.params = [first];
    else resolved.options = { ...resolved.options, ...(first as SDSCallOptions) };
  }

  if (typeof second === 'function') {
    resolved.callback = second as Callback<any>;
  } else if (isPlainObject(second)) {
    resolved.options = { ...resolved.options, ...(second as SDSCallOptions) };
  }

  if (typeof third === 'function') {
    resolved.callback = third as Callback<any>;
  }

  return resolved;
}

/**
 * Client for the Steem Blockchain Data Services (SDS) REST API.
 *
 * Every SDS module is exposed as a namespace (`sds.chain`, `sds.posts`, …) and
 * every SDS method as a function that returns a promise and accepts an
 * optional node style callback as its last argument.
 */
export class SDS implements SDSModules {
  /** Base URL of the configured instance, e.g. `https://sds0.steemworld.org`. */
  readonly baseUrl: string;
  /** Name (or URL) of the configured instance. */
  readonly instance: string;
  /** Fully resolved options (defaults applied). */
  readonly options: ResolvedSDSOptions;

  /** `blocks_api` */
  readonly blocks: SDSModules['blocks'];
  /** `chain_api` */
  readonly chain: SDSModules['chain'];
  /** `steem_requests_api` */
  readonly steemRequests: SDSModules['steemRequests'];
  /** `transactions_api` */
  readonly transactions: SDSModules['transactions'];
  /** `accounts_api` */
  readonly accounts: SDSModules['accounts'];
  /** `account_history_api` */
  readonly accountHistory: SDSModules['accountHistory'];
  /** `authorities_api` */
  readonly authorities: SDSModules['authorities'];
  /** `delegations_api` */
  readonly delegations: SDSModules['delegations'];
  /** `followers_api` */
  readonly followers: SDSModules['followers'];
  /** `mentions_api` */
  readonly mentions: SDSModules['mentions'];
  /** `notifications_api` */
  readonly notifications: SDSModules['notifications'];
  /** `rewards_api` */
  readonly rewards: SDSModules['rewards'];
  /** `transfers_api` */
  readonly transfers: SDSModules['transfers'];
  /** `witnesses_api` */
  readonly witnesses: SDSModules['witnesses'];
  /** `communities_api` */
  readonly communities: SDSModules['communities'];
  /** `content_history_api` */
  readonly contentHistory: SDSModules['contentHistory'];
  /** `content_search_api` */
  readonly contentSearch: SDSModules['contentSearch'];
  /** `feeds_api` */
  readonly feeds: SDSModules['feeds'];
  /** `posts_api` */
  readonly posts: SDSModules['posts'];
  /** `post_resteems_api` */
  readonly postResteems: SDSModules['postResteems'];
  /** `post_tags_api` */
  readonly postTags: SDSModules['postTags'];
  /** `system_api` */
  readonly system: SDSModules['system'];

  constructor(options: SDSOptions = {}) {
    this.options = resolveOptions(options);
    this.baseUrl = this.options.baseUrl;
    this.instance = this.options.instance ?? this.baseUrl;

    this.blocks = this.createModule('blocks_api');
    this.chain = this.createModule('chain_api');
    this.steemRequests = this.createModule('steem_requests_api');
    this.transactions = this.createModule('transactions_api');
    this.accounts = this.createModule('accounts_api');
    this.accountHistory = this.createModule('account_history_api');
    this.authorities = this.createModule('authorities_api');
    this.delegations = this.createModule('delegations_api');
    this.followers = this.createModule('followers_api');
    this.mentions = this.createModule('mentions_api');
    this.notifications = this.createModule('notifications_api');
    this.rewards = this.createModule('rewards_api');
    this.transfers = this.createModule('transfers_api');
    this.witnesses = this.createModule('witnesses_api');
    this.communities = this.createModule('communities_api');
    this.contentHistory = this.createModule('content_history_api');
    this.contentSearch = this.createModule('content_search_api');
    this.feeds = this.createModule('feeds_api');
    this.posts = this.createModule('posts_api');
    this.postResteems = this.createModule('post_resteems_api');
    this.postTags = this.createModule('post_tags_api');
    this.system = this.createModule('system_api');
  }

  /* ---------------------------------------------------------------- */
  /* generic entry points                                              */
  /* ---------------------------------------------------------------- */

  /**
   * Calls any SDS method by name — including methods that are not part of the
   * bundled reference yet.
   *
   * ```ts
   * await sds.call('chain_api', 'getConfig');
   * await sds.call('chain_api', 'getAccountNames', [10, 0]);
   * await sds.call('chain_api', 'getAccountNames', [10, 0], { timeout: 5000 });
   * await sds.call('chain_api', 'getAccountNames', [10, 0], (err, names) => { … });
   * ```
   */
  call<T = any>(
    moduleId: string,
    method: string,
    params: readonly unknown[] | null | undefined,
    options?: SDSCallOptions,
  ): Promise<T>;
  call<T = any>(
    moduleId: string,
    method: string,
    params: readonly unknown[] | null | undefined,
    callback: Callback<T>,
  ): Promise<void>;
  call<T = any>(
    moduleId: string,
    method: string,
    params: readonly unknown[] | null | undefined,
    options: SDSCallOptions,
    callback: Callback<T>,
  ): Promise<void>;
  call<T = any>(moduleId: string, method: string, callback: Callback<T>): Promise<void>;
  call<T = any>(
    moduleId: string,
    method: string,
    params?: unknown,
    optionsOrCallback?: unknown,
    maybeCallback?: unknown,
  ): Promise<any> {
    const resolved = resolveCallArgs(params, optionsOrCallback, maybeCallback);
    const callOptions: SDSCallOptions = {
      validate: this.options.validate,
      ...resolved.options,
    };
    const validate = callOptions.validate ?? this.options.validate;

    const promise = (async (): Promise<T> => {
      const meta = findMethod(moduleId, method);

      if (!meta) {
        // Unknown method: forward the values without metadata validation.
        const segments = (resolved.params ?? []).map((value) => basicFormat(value));
        const path = this.buildUnknownPath(moduleId, method, segments);
        return invoke(this.options, { path, module: moduleId, method }, callOptions);
      }

      const segments = resolveSegments(meta, resolved.params ?? [], { validate });
      const path = buildPath(meta.path, this.encodeSegments(segments), {
        module: meta.module,
        method: meta.name,
      });
      return invoke(this.options, { path, module: meta.module, method: meta.name }, callOptions);
    })();

    return settle<T>(promise, resolved.callback);
  }

  /**
   * Performs a raw GET against the SDS instance and unwraps the
   * `{ code, result }` envelope. The path must start with `/`.
   *
   * ```ts
   * await sds.request('/chain_api/getConfig');
   * await sds.request('/system_api/getVersion', (err, version) => { … });
   * ```
   */
  request<T = any>(path: string, options?: SDSCallOptions): Promise<T>;
  request<T = any>(path: string, callback: Callback<T>): Promise<void>;
  request<T = any>(path: string, options: SDSCallOptions, callback: Callback<T>): Promise<void>;
  request<T = any>(path: string, optionsOrCallback?: unknown, maybeCallback?: unknown): Promise<any> {
    const resolved = resolveCallArgs(undefined, optionsOrCallback, maybeCallback);
    const target = path.startsWith('/') ? path : `/${path}`;
    const promise = invoke(this.options, { path: target }, resolved.options);
    return settle<T>(promise, resolved.callback);
  }

  /* ---------------------------------------------------------------- */
  /* introspection                                                     */
  /* ---------------------------------------------------------------- */

  /** All modules of the bundled reference. */
  listModules(): SDSModuleMeta[] {
    return listModules();
  }

  /** All methods, or only the methods of `moduleId`. */
  listMethods(moduleId?: string): SDSMethodMeta[] {
    return listMethods(moduleId);
  }

  /** Looks a method up by `'chain_api.getAccountNames'` or `('chain_api', 'getAccountNames')`. */
  describeMethod(moduleIdOrKey: string, method?: string): SDSMethodMeta | undefined {
    const meta = findMethod(moduleIdOrKey, method);
    return meta ? { ...meta, params: meta.params.map((param) => ({ ...param })) } : undefined;
  }

  /** Whether the given module/method exists in the bundled reference. */
  hasMethod(moduleIdOrKey: string, method?: string): boolean {
    return findMethod(moduleIdOrKey, method) !== undefined;
  }

  /** Namespace of a module by its id, e.g. `sds.module('chain_api')` → `sds.chain`. */
  module<M extends keyof SDSModuleKeys>(moduleId: M): SDSModules[SDSModuleKeys[M]];
  module(moduleId: string): unknown;
  module(moduleId: string): unknown {
    const meta = getModule(moduleId);
    if (!meta) {
      throw new SDSArgumentError(
        `Unknown SDS module "${moduleId}". Available modules: ${listModules()
          .map((module) => module.id)
          .join(', ')}`,
      );
    }
    return (this as unknown as Record<string, unknown>)[meta.key];
  }

  /** The reference version the bundled metadata was generated from. */
  get referenceVersion(): string {
    return SDS_REFERENCE_VERSION;
  }

  /** The instance the bundled metadata was generated from. */
  get referenceSource(): string {
    return SDS_REFERENCE_SOURCE;
  }

  /* ---------------------------------------------------------------- */
  /* derived clients                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * Returns a new client sharing the same instance but with different
   * options (timeout, headers, retries, …).
   *
   * ```ts
   * const fast = sds.withOptions({ timeout: 3000 });
   * const authed = sds.withOptions({ headers: { authorization: `Bearer ${token}` } });
   * ```
   */
  withOptions(options: SDSOptions): SDS {
    const defined = Object.fromEntries(
      Object.entries(options).filter(([, value]) => value !== undefined),
    ) as SDSOptions;

    const merged: SDSOptions = {
      ...this.toOptions(),
      ...defined,
      instances: { ...this.options.instances, ...defined.instances },
      headers: { ...this.options.headers, ...defined.headers },
    };
    return new SDS(merged);
  }

  /** The options this client was created with (defaults applied). */
  toOptions(): SDSOptions {
    return {
      instance: this.options.instance,
      baseUrl: this.options.baseUrl,
      instances: { ...this.options.instances },
      timeout: this.options.timeout,
      retries: this.options.retries,
      retryDelay: this.options.retryDelay,
      headers: { ...this.options.headers },
      fetch: this.options.fetch,
      validate: this.options.validate,
      encode: this.options.encode,
      onRequest: this.options.onRequest,
      onResponse: this.options.onResponse,
    };
  }

  /* ---------------------------------------------------------------- */
  /* internals                                                         */
  /* ---------------------------------------------------------------- */

  private createModule<M extends keyof SDSModuleKeys>(moduleId: M): SDSModules[SDSModuleKeys[M]] {
    const meta = getModule(moduleId);
    if (!meta) {
      throw new SDSArgumentError(`Unknown SDS module "${moduleId}"`);
    }
    const namespace: Record<string, unknown> = {};
    for (const method of meta.methods) {
      namespace[method.name] = this.createMethod(meta, method);
    }
    return namespace as unknown as SDSModules[SDSModuleKeys[M]];
  }

  private createMethod(module: SDSModuleMeta, method: SDSMethodMeta) {
    const client = this;
    return (...args: unknown[]): Promise<any> => {
      const { callback, values } = splitCallback(args);
      const promise = (async () => {
        const segments = resolveSegments(method, values, {
          validate: client.options.validate,
        });
        const path = buildPath(method.path, client.encodeSegments(segments), {
          module: method.module,
          method: method.name,
        });
        return invoke(client.options, { path, module: method.module, method: method.name });
      })();
      return settle(promise, callback);
    };
  }

  private encodeSegments(segments: readonly string[]): string[] {
    if (!this.options.encode) return [...segments];
    return segments.map((segment) => encodeURIComponent(segment));
  }

  /** Builds the path of a method that is not part of the bundled reference. */
  private buildUnknownPath(
    moduleId: string,
    method: string,
    segments: readonly string[],
  ): string {
    const parts = [`/${moduleId}/${method}`];
    for (const segment of segments) {
      parts.push(this.options.encode ? encodeURIComponent(segment) : segment);
    }
    return parts.join('/');
  }
}

/** Default export for `import SDS from '@steempro/sds-api'`. */
export default SDS;
