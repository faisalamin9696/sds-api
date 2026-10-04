/**
 * `@steempro/sds` — typed JavaScript / TypeScript client for the Steem
 * Blockchain Data Services (SDS) REST API (https://sds0.steemworld.org).
 *
 * @example Promise style
 * ```ts
 * import { SDS } from '@steempro/sds';
 *
 * const sds = new SDS({ instance: 'sds0' });
 * const stats = await sds.chain.getChainStats();
 * ```
 *
 * @example Callback style
 * ```ts
 * sds.posts.getPost('steemchiller', 'hello', (error, post) => {
 *   if (error) return console.error(error.code, error.message);
 *   console.log(post);
 * });
 * ```
 */
export { SDS, SDS as SDSClient, createSDS, registerInstance, listInstances, DEFAULT_SDS_INSTANCES } from './client';
export { default } from './client';

export * from './errors';
export { COMMUNITY_ID_PATTERN, isCommunityParam, isTimestampParam, coerceTimestamp } from './core/params';
export * from './map';
export * from './meta';
export * from './meta-types';
export * from './types';
export * from './generated/types';
