/**
 * Runner for the live test suite (tests against a real SDS instance).
 *
 *   npm run test:live
 *   SDS_LIVE_INSTANCE=sds1 npm run test:live
 */
import { spawnSync } from 'node:child_process';

const instance = process.env.SDS_LIVE_INSTANCE ?? 'sds0';

console.log(`Running live tests against SDS instance "${instance}"…`);

const result = spawnSync('npx', ['vitest', 'run', 'test/live.test.ts'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    SDS_LIVE: '1',
    SDS_LIVE_INSTANCE: instance,
  },
});

process.exit(result.status ?? 1);
