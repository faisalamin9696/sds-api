# @steempro/sds

[![npm version](https://img.shields.io/npm/v/@steempro/sds.svg)](https://www.npmjs.com/package/@steempro/sds)
[![license](https://img.shields.io/npm/license/@steempro/sds.svg)](https://github.com/faisalamin9696/sds/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/@steempro/sds.svg)](https://www.npmjs.com/package/@steempro/sds)

Typed JavaScript / TypeScript client for the **Steem Blockchain Data Services
(SDS)** REST API — [sds0.steemworld.org](https://sds0.steemworld.org).
Source: [github.com/faisalamin9696/sds](https://github.com/faisalamin9696/sds).

- **Every module and method** of the SDS reference: 22 modules, 285 methods,
  fully typed with generated parameter/result interfaces.
- **Promise *and* node-style callback** support on every method.
- **`mapSds()`** — turns SDS's column oriented `{ cols, rows }` payloads into
  plain row objects (and passes everything else through unchanged).
- **Structured errors** — one error class per failure mode, each with a stable
  machine readable `code`.
- **Bring your own instance** — `sds0`, `sds1`, `sds`, or any custom SDS URL.
- **Retries, timeouts, abort signals, hooks**, client-side validation and
  introspection APIs.
- ESM + CJS builds, zero runtime dependencies, Node 18+ / Deno / Bun / browsers
  (anything with `fetch`).

```bash
npm i @steempro/sds
```

📚 **[Full documentation](documentation.md)** — every one of the 285 methods
indexed, with signatures, parameters and runnable examples.
[Method tables](docs/METHODS.md) · [README](README.md).

## Quick start

```ts
import { SDS } from '@steempro/sds';

const sds = new SDS(); // → https://sds0.steemworld.org

// Promise style
const stats = await sds.chain.getChainStats();

// Callback style (last argument is always the callback)
sds.posts.getPost('steemchiller', 'hello', (error, post) => {
  if (error) return console.error(error.code, error.message);
  console.log(post);
});
```

ESM and CommonJS are both supported:

```js
const { SDS } = require('@steempro/sds');
```

## Choosing an SDS instance

```ts
new SDS();                             // sds0 (default)
new SDS({ instance: 'sds1' });         // bundled instance name
new SDS({ instance: 'sds' });          // bundled instance name
new SDS({ baseUrl: 'https://my-sds.example.org' });  // any custom URL
new SDS({ instance: 'sds9', instances: { sds9: 'https://sds9.example.org' } });
```

Register an instance for the whole process:

```ts
import { registerInstance, listInstances } from '@steempro/sds';

registerInstance('sds9', 'https://sds9.example.org');
const sds = new SDS({ instance: 'sds9' });
```

`DEFAULT_SDS_INSTANCES` contains the bundled names (`sds`, `sds0`, `sds1`).

## Calling methods

Every generated method accepts its parameters **positionally (in route
order)** or as a **single object keyed by parameter name**, plus an optional
trailing callback:

```ts
// positional (route order)
await sds.chain.getAccountNamesByPrefix('ste', 50);

// object style
await sds.chain.getAccountNamesByPrefix({ prefix: 'ste', limit: 50 });

// callback style — either form
sds.chain.getAccountNamesByPrefix({ prefix: 'ste' }, (err, names) => { … });
```

Optional trailing parameters are simply omitted — SDS applies their documented
defaults. If a parameter is skipped in the middle of a route, the client fills
it with the documented default (or the literal `null` placeholder SDS accepts).

**Community parameters** (e.g. `community` on `communities_api` / `feeds_api`)
take a **hive community id** — always `hive-` prefixed, e.g. `hive-160125`.
Bare ids (`160125`), titles (`steemit-news`) and regular accounts (`alice`)
pass SDS but come back empty, so the client rejects them during validation
(pass `validate: false` to bypass):

```ts
await sds.communities.getCommunity('hive-160125');   // ✅ real data
await sds.communities.getCommunity('160125');        // ❌ SDSValidationError
                                                     //    "…must be a hive community id
                                                     //     starting with \"hive-\" (e.g. \"hive-160125\")"
// The rule is exported for your own checks:
import { isCommunityParam, COMMUNITY_ID_PATTERN } from '@steempro/sds';
```

**Timestamp parameters** (`fromTime`, `toTime`, `blockTime`, …) accept **any
date form** — a `Date`, a date string or unix seconds — and are converted to
unix **seconds** (the unit SDS expects) before the request is sent:

```ts
await sds.accountHistory.getHistoryByTime(
  'steemit',
  new Date('2020-09-14T00:00:00Z'),   // Date
  '2020-09-15 12:30:00',              // date string — zone-less means UTC
  100,
);

await sds.chain.getBlockInfoByTime('2020-09-13 12:26:40');   // → 1600000000
await sds.chain.getBlockInfoByTime(1600000000000);           // ms auto-detected → 1600000000

// A value that cannot be understood throws before anything is sent:
// SDSValidationError: Parameter "fromTime" of account_history_api.getHistoryByTime
// must be a timestamp, got "yesterday". Pass a Date, a date/time string (e.g.
// "2020-09-13", "2020-09-13 12:30:00", "2020-09-13T12:30:00+02:00") or a unix
// timestamp in seconds (12+ digit numbers are read as milliseconds).

// The conversion is exported for your own code:
import { coerceTimestamp, isTimestampParam } from '@steempro/sds';
coerceTimestamp('2020-09-13');   // 1599955200 (2020-09-13T00:00:00Z)
```

Accepted forms: `Date` objects, `2020-09-13`, `2020/09/13`, `2020-09`, date-times
with or without seconds (`2020-09-13 12:30`, `2020-09-13T12:30:00`), anything with
an explicit zone (`Z`, `+02:00` — those keep their zone), other formats `Date`
parses (RFC 2822, `May 1, 2020`, …) and unix seconds. Timestamps inside JSON
queries (`{ type: 'transfer', fromTime: '2020-09-13' }`) are converted the same
way.

### Generic entry points

Not everything needs a generated wrapper:

```ts
// By name, with params array + per call options
await sds.call('chain_api', 'getAccountNames', [10, 0], { timeout: 5000 });

// Even methods missing from the bundled reference work (raw segments)
await sds.call('brand_new_api', 'getThing', ['a', 'b']);

// Raw GET, unwraps the { code, result } envelope
await sds.request('/chain_api/getConfig');
```

## Mapping `{ cols, rows }` responses with `mapSds`

Some SDS list/search methods return a column oriented table instead of objects:

```json
{ "cols": { "link_id": 0, "author": 6, "permlink": 7 },
  "rows": [[114136936, 0, 69.305, 0, "", "", "alice", "hello"]] }
```

`mapSds()` converts that to plain row objects, and **passes any other payload
through unchanged**, so it is safe to chain on any call:

```ts
import { mapSds, isSDSTable } from '@steempro/sds';

const rows = mapSds(await sds.feeds.getActivePostsByCreated({ limit: 1 }));
// [{ link_id: 114136936, author: 'alice', permlink: 'hello', … }, …]

// …or as a promise continuation:
const rows2 = await sds.feeds.getActivePostsByTrending().then(mapSds);

// Narrow first when the payload type is unknown:
const payload: unknown = await sds.request('/feeds_api/getActivePostsByTrending');
const rows3 = isSDSTable(payload) ? mapSds(payload) : payload;
```

It maps by the `cols` **name → index** entries (not by key order), supports
array style `cols`, keeps already keyed rows, handles single-column scalar
rows, returns `[]` for an empty table, and unwraps raw `{ code, result }`
envelopes first. A non-table payload (plain object, array, scalar) is returned
as-is, and the overloads preserve that type (`mapSds<T>(payload)`).

## Error handling

Every failure is an `SDSError` subclass with a stable `code`, plus the
`module`, `method` and `url` of the failing call:

| Class                 | `code`                 | When                                             |
| --------------------- | ---------------------- | ------------------------------------------------ |
| `SDSValidationError`  | `ERR_SDS_VALIDATION`   | Parameter failed type/range/allow-list validation |
| `SDSArgumentError`    | `ERR_SDS_ARGUMENT`     | Unknown method/instance/parameter, wrong arity    |
| `SDSNetworkError`     | `ERR_SDS_NETWORK`      | Request never reached SDS (DNS, CORS, offline)    |
| `SDSTimeoutError`     | `ERR_SDS_TIMEOUT`      | Request exceeded `timeout`                        |
| `SDSAbortError`       | `ERR_SDS_ABORT`        | Cancelled through an `AbortSignal`                |
| `SDSHttpError`        | `ERR_SDS_HTTP`         | Non-success HTTP status (e.g. 404 unknown route)  |
| `SDSResponseError`    | `ERR_SDS_RESPONSE`     | HTTP 200 but not the expected JSON envelope       |
| `SDSApiError`         | `ERR_SDS_API`          | Application error: `{ code: -1, error: "…" }`     |

```ts
import { SDSApiError, isSDSError } from '@steempro/sds';

try {
  await sds.posts.getPost('alice', 'missing');
} catch (error) {
  if (error instanceof SDSApiError) {
    console.log(error.apiCode, error.errorMessage);   // -1, "Link id … does not exist"
  }
  if (isSDSError(error)) console.log(error.toJSON()); // safe to log / serialize
}
```

Callback style delivers the same errors: `callback(error)` on failure,
`callback(null, result)` on success. Validation errors are passed to the
callback rather than thrown.

## Retries, timeouts, cancellation

```ts
const sds = new SDS({
  timeout: 10_000,   // per request, ms (default 30_000)
  retries: 2,        // network / timeout / 5xx / 429 retries (default 2)
  retryDelay: 300,   // exponential backoff base, ms (default 300)
});

// Per call overrides + cancellation
const controller = new AbortController();
await sds.call('chain_api', 'getConfig', null, {
  timeout: 2000,
  retries: 0,
  signal: controller.signal,
  headers: { 'x-api-key': '…' },
});
```

Application errors (`ERR_SDS_API`) and 4xx responses are never retried.

## Derived clients

```ts
const fast     = sds.withOptions({ timeout: 3000 });
const authed   = sds.withOptions({ headers: { authorization: `Bearer ${token}` } });
const quiet    = sds.withOptions({ retries: 0 });
```

## Hooks (logging / tracing)

```ts
const sds = new SDS({
  onRequest:  ({ url, module, method, attempt }) => console.log('→', url),
  onResponse: ({ url, status, durationMs, ok })   => console.log('←', status, durationMs, ok),
});
```

## Introspection — list all methods and parameters

The bundled reference can be queried at runtime:

```ts
import { listModules, listMethods, findMethod, API_REFERENCE } from '@steempro/sds';

sds.listModules();                          // 22 modules
sds.listMethods('chain_api');               // methods of one module
sds.describeMethod('chain_api.getAccountNames');
// → { name, path, description, params: [{ name, type, optional, default, min, max, … }], result }

sds.hasMethod('posts_api', 'getPost');      // true
sds.referenceVersion;                       // SDS reference version of the bundle
API_REFERENCE;                              // full metadata (source, version, modules)
```

A human readable list of **every module, method and parameter** is generated
into [`docs/METHODS.md`](./docs/METHODS.md).

## TypeScript

The package ships its own types (`ESM` + `CJS` + `.d.ts`). Every method has
generated argument interfaces and result types:

```ts
import type { ChainGetAccountNamesArgs, PostsGetPostArgs } from '@steempro/sds';

const args: ChainGetAccountNamesArgs = { limit: 10, offset: 0 };
const names = await sds.chain.getAccountNames(args);
```

Result types map SDS's `JSON Object` / `JSON Array` / `integer` / `string`
returns to `SDSJsonObject` / `SDSJsonArray` / `number` / `string`; pass a type
parameter to narrow them:

```ts
const config = await sds.chain.getConfig<{ STM: string }>();
```

## Options reference

| Option         | Default            | Description                                             |
| -------------- | ------------------ | ------------------------------------------------------- |
| `instance`     | `'sds0'`           | Bundled instance name or full URL                       |
| `baseUrl`      | –                  | Full base URL (takes precedence over `instance`)        |
| `instances`    | –                  | Extra `{ name: url }` pairs for this client             |
| `timeout`      | `30000`            | Request timeout in ms (`0` disables)                    |
| `retries`      | `2`                | Retries for network/timeout/5xx/429                     |
| `retryDelay`   | `300`              | Exponential backoff base in ms                          |
| `headers`      | `{}`               | Extra headers for every request                         |
| `fetch`        | `globalThis.fetch` | Custom fetch implementation                             |
| `validate`     | `true`             | Client-side parameter validation                        |
| `encode`       | `true`             | URL-encode path segments                                |
| `onRequest`    | –                  | Hook before each attempt                                |
| `onResponse`   | –                  | Hook after each attempt (success or failure)            |

## Development

```bash
npm install
npm run scrape     # refresh data/api.json from the live SDS reference
npm run generate   # regenerate src/generated/* and docs/METHODS.md
npm run typecheck
npm test           # unit tests (mocked fetch)
npm run test:live  # tests against the real SDS (SDS_LIVE_INSTANCE=sds1 to switch)
npm run build      # dist/ (ESM + CJS + types)
```

## License

MIT
