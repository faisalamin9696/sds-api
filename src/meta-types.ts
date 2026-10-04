/**
 * Metadata types shared by the scraper, the code generator and the runtime.
 *
 * The shapes are generated from the official SDS API Reference
 * (https://sds0.steemworld.org) by `npm run scrape` and written to
 * `data/api.json`.
 */

/** A field of a structured (`json_object`) parameter. */
export interface SDSFieldMeta {
  /** Dot path of the field, e.g. `filter.vote.minSP`. */
  name: string;
  /** SDS type of the field, e.g. `json_object`, `float`, `bool`. */
  type: string;
  /** `true` when the field may be omitted. */
  optional: boolean;
  /** Default value as documented by SDS. */
  default?: string;
  /** Allowed values as documented by SDS. */
  allowedValues?: string[];
  /** Nested fields (for nested structured parameters). */
  fields?: SDSFieldMeta[];
}

/** A single method parameter (a path segment of the REST route). */
export interface SDSParamMeta {
  /** Parameter name without the leading `:`, e.g. `limit`. */
  name: string;
  /** SDS type, e.g. `int`, `string`, `account_name`, `fixed_value`, `json_object`. */
  type: string;
  /** `true` when the parameter may be omitted. */
  optional: boolean;
  /** Default value as documented by SDS, e.g. `250`, `null`, `DESC`. */
  default?: string;
  /** Minimum value (numeric parameters). */
  min?: number;
  /** Maximum value (numeric parameters). */
  max?: number;
  /** Allowed values (parameters of type `fixed_value`). */
  allowedValues?: string[];
  /** Documented structure of `json_object` parameters. */
  fields?: SDSFieldMeta[];
}

/** A single SDS method. */
export interface SDSMethodMeta {
  /** Parent module id, e.g. `chain_api`. */
  module: string;
  /** Method name, e.g. `getAccountNames` (may contain dots, e.g. `condenser_api.get_ticker`). */
  name: string;
  /** Full route template, e.g. `/chain_api/getAccountNames/:limit?/:offset?`. */
  path: string;
  /** Ordered parameters (path segments after the method name). */
  params: SDSParamMeta[];
  /** Documentation text from the SDS reference. */
  description?: string;
  /** Example route from the SDS reference. */
  example?: string;
  /** Documented result type, e.g. `JSON Object`, `JSON Array`, `string`. */
  result?: string;
  /** Maximum value of the `limit` parameter (when documented). */
  maxLimit?: number;
  /** Sub section of the module page, e.g. `Filtered`. */
  section?: string;
}

/** An SDS module (a namespace of the client, e.g. `chain_api`). */
export interface SDSModuleMeta {
  /** Module id used by the REST API, e.g. `chain_api`. */
  id: string;
  /** Client namespace derived from the id, e.g. `chain`, `steemRequests`. */
  key: string;
  /** Group of the reference home page: `Base`, `Accounts`, `Posts` or `System`. */
  group: string;
  /** Methods of this module (in reference order). */
  methods: SDSMethodMeta[];
}

/** Root document written to `data/api.json`. */
export interface SDSApiReference {
  /** Instance the reference was scraped from. */
  source: string;
  /** Version string shown by the reference. */
  version: string;
  /** ISO timestamp of the scrape. */
  scrapedAt: string;
  modules: SDSModuleMeta[];
}
