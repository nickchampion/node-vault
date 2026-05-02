import { defineConfig } from 'vitest/config'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig({
  plugins: [nxViteTsPaths()],
  test: {
    globals: true,
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/test/**', '**/.storybook/**', '**/mocks/**'],
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/.output/**', '**/.nuxt/**'],
    projects: [
      {
        test: {
          name: { label: 'libs', color: 'green' },
          include: ['libs/**/*.spec.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: { label: 'backoffice', color: 'blue' },
          include: ['apps/backoffice/**/*.spec.ts'],
          environment: 'happy-dom',
        },
      },
      {
        test: {
          name: { label: 'trading', color: 'magenta' },
          include: ['apps/trading/**/*.spec.ts'],
          environment: 'happy-dom',
        },
      },
    ],
  },
})
