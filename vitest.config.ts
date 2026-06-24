import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // 'jsdom' not needed for just math functions
    include: ['src/**/*.test.ts'],
  },
});
