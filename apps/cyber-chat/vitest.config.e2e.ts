import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'], // Sucht gezielt nach E2E-Testdateien
    globals: true,
    root: './',
  },
  plugins: [swc.vite()],
});
