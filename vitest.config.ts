import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // Live tests hit the real SDS instance and are opt-in (`npm run test:live`
    // sets SDS_LIVE=1 and runs vitest directly on the file).
    exclude:
      process.env.SDS_LIVE === '1' ? ['node_modules/**'] : ['test/live.test.ts', 'node_modules/**'],
  },
});
