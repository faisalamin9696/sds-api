/**
 * Live tests against a real SDS instance.
 *
 * Opt-in: run with `SDS_LIVE=1 npm test -- test/live.test.ts` or use
 * `npm run test:live` (which also allows selecting the instance with
 * `SDS_LIVE_INSTANCE=sds1`).
 */
import { describe, expect, it } from 'vitest';
import { SDS, registerInstance } from '../src/client';
import { mapSds } from '../src/map';

const instance = process.env.SDS_LIVE_INSTANCE ?? 'sds0';

describe(`live: ${instance}`, () => {
  const sds = new SDS({ instance, timeout: 20_000, retries: 1 });

  it('chain.getConfig returns an object', async () => {
    const config = await sds.chain.getConfig();
    expect(config).toBeTypeOf('object');
    expect(config).not.toBeNull();
  });

  it('chain.getChainStats returns chain counters', async () => {
    const stats = await sds.chain.getChainStats();
    expect(stats).toBeTypeOf('object');
    expect(stats).toHaveProperty('count_accounts');
    expect(stats).toHaveProperty('count_posts');
  });

  it('builds range routes: getBlocksInRange(1, 2)', async () => {
    const blocks = await sds.blocks.getBlocksInRange(1, 2);
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.length).toBeLessThanOrEqual(2);
  });

  it('chain.getAccountNamesByPrefix returns matching names', async () => {
    const names = await sds.chain.getAccountNamesByPrefix('NOTVALID');
    expect(Array.isArray(names)).toBe(true);
    // SDS lowercases the prefix before matching.
    for (const name of names) expect(String(name).startsWith('notvalid')).toBe(true);

    const matches = await sds.chain.getAccountNamesByPrefix('not', 5);
    expect(matches.length).toBeLessThanOrEqual(5);
    for (const name of matches) expect(String(name).startsWith('not')).toBe(true);
  });

  it('callback style receives (null, result)', async () => {
    await new Promise<void>((resolve, reject) => {
      sds.chain.getConfig((error, config) => {
        if (error) reject(error);
        else {
          expect(config).toBeTypeOf('object');
          resolve();
        }
      });
    });
  });

  it('callback style receives a typed error for application failures', async () => {
    await new Promise<void>((resolve, reject) => {
      // `null` prefix + invalid limit should be rejected by SDS or validation.
      sds.request('/chain_api/getAccountNamesByPrefix', (error, result) => {
        try {
          expect(error).not.toBeNull();
          expect(error?.code).toMatch(/^ERR_SDS_/);
          expect(result).toBeUndefined();
          resolve();
        } catch (assertion) {
          reject(assertion);
        }
      });
    });
  });

  it('unknown routes fail with an HTTP error, not a crash', async () => {
    const error = await sds.request('/nope_api/getNothing').catch((e) => e);
    expect(error.code).toBe('ERR_SDS_HTTP');
    expect(error.status).toBe(404);
  });

  it('system.getVersion answers', async () => {
    const version = await sds.system.getVersion();
    expect(version).toBeTruthy();
  });

  it('posts.getPost of a real post works (placeholder + optional segments)', async () => {
    // Find a recent post first so the test does not depend on a fixed link.
    // Feeds return `{ cols: { name: index }, rows: [[…], …] }`.
    const feed = await sds.feeds.getActivePostsByCreated({ limit: 1 });
    expect(Array.isArray(feed.rows)).toBe(true);
    const row = feed.rows[0];
    const author = String(row[feed.cols.author]);
    const permlink = String(row[feed.cols.permlink]);
    expect(author).not.toBe('');

    const post = await sds.posts.getPost(author, permlink);
    expect(post).toBeTypeOf('object');
    expect(post.author).toBe(author);
    expect(post.permlink).toBe(permlink);
  });

  it('mapSds converts a real { cols, rows } feed into row objects', async () => {
    const feed = await sds.feeds.getActivePostsByCreated({ limit: 3 });
    const rows = mapSds(feed);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('author');
    expect(typeof rows[0].author).toBe('string');
    // Non table payloads pass through unchanged.
    const config = await sds.chain.getConfig();
    expect(mapSds(config)).toBe(config);
  });

  it('community params require a hive community id', async () => {
    // hive- prefixed id → real data …
    const community = await sds.communities.getCommunity('hive-160125');
    expect(community).toHaveProperty('account', 'hive-160125');

    // …while a bare id / account is rejected before anything is sent …
    await expect(sds.communities.getCommunity('160125')).rejects.toThrow(/hive community id/);
    await expect(sds.communities.getCommunity('alice')).rejects.toThrow(/hive community id/);

    // …and SDS itself would have answered with empty data for those.
    const empty = await sds.request('/communities_api/getCommunityRoles/160125');
    expect(empty.rows).toEqual([]);
  });

  it('timestamp params accept Date, date strings and milliseconds', async () => {
    const from = Math.floor(Date.now() / 1000) - 86400 * 30; // 30 days ago (immutable history)
    const to = from + 86400 * 10;

    const bySeconds = await sds.accountHistory.getHistoryByTime('steemit', from, to, 5);
    const byDates = await sds.accountHistory.getHistoryByTime(
      'steemit',
      new Date(from * 1000),
      new Date(to * 1000),
      5,
    );
    const byStrings = await sds.accountHistory.getHistoryByTime(
      'steemit',
      new Date(from * 1000).toISOString(),
      new Date(to * 1000).toISOString(),
      5,
    );

    expect(bySeconds.rows.length).toBeGreaterThan(0);
    expect(byDates.rows).toEqual(bySeconds.rows);
    expect(byStrings.rows).toEqual(bySeconds.rows);

    // A value SDS cannot understand is rejected before anything is sent …
    await expect(
      sds.accountHistory.getHistoryByTime('steemit', 'yesterday', to, 5),
    ).rejects.toThrow(/must be a timestamp/);

    // … while seconds, date strings and milliseconds all resolve to the same block
    // (`1600000000` = 2020-09-13T12:26:40Z; without conversion the ms value would
    // be read as a far-future second and clamp to the newest block instead).
    const [bySecond, byDate, byMs] = await Promise.all([
      sds.chain.getBlockInfoByTime(1600000000),
      sds.chain.getBlockInfoByTime('2020-09-13 12:26:40'),
      sds.chain.getBlockInfoByTime(1600000000000),
    ]);
    expect(bySecond.time).toBeLessThanOrEqual(1600000000);
    expect(bySecond.time).toBeGreaterThan(1600000000 - 600);
    expect(byDate.time).toBe(bySecond.time);
    expect(byMs.time).toBe(bySecond.time);
  });

  it('custom instances can be registered and used', async () => {
    const url = sds.baseUrl;
    registerInstance('sdsLiveCustom', url);
    const custom = new SDS({ instance: 'sdsLiveCustom', timeout: 20_000, retries: 1 });
    expect(custom.baseUrl).toBe(url);
    const config = await custom.chain.getConfig();
    expect(config).toBeTypeOf('object');
  });
});
