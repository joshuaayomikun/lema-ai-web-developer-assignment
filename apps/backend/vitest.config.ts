import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/backend/src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: path.resolve(__dirname, '../../coverage/apps/backend'),
      include: ['apps/backend/src/**/*.ts'],
      exclude: ['apps/backend/src/**/*.test.ts', 'apps/backend/src/**/*.d.ts'],
    },
  },
});
