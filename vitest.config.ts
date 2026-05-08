import path from 'node:path'
import { defineConfig } from 'vitest/config'

const alias = {
  '@nodevault/platform.apps.api': path.resolve('./apps/api/index.ts'),
  '@nodevault/platform.apps.nodevault': path.resolve('./apps/nodevault/index.ts'),
  '@nodevault/platform.components.api.client': path.resolve('./components/api/client/index.ts'),
  '@nodevault/platform.components.api.server': path.resolve('./components/api/server/index.ts'),
  '@nodevault/platform.components.api.schemas': path.resolve('./components/api/schemas/index.ts'),
  '@nodevault/platform.components.configuration.core': path.resolve('./components/configuration/core/index.ts'),
  '@nodevault/platform.components.configuration.server': path.resolve('./components/configuration/server/index.ts'),
  '@nodevault/platform.components.configuration.client': path.resolve('./components/configuration/client/index.ts'),
  '@nodevault/platform.components.ravendb': path.resolve('./components/ravendb/index.ts'),
  '@nodevault/platform.components.search': path.resolve('./components/search/index.ts'),
  '@nodevault/platform.components.domain': path.resolve('./components/domain/index.ts'),
  '@nodevault/platform.components.context': path.resolve('./components/context/index.ts'),
  '@nodevault/platform.components.utils': path.resolve('./components/utils/index.ts'),
  '@nodevault/platform.components.utils.server': path.resolve('./components/utils-server/index.ts'),
  '@nodevault/platform.integrations.resend': path.resolve('./integrations/resend/index.ts'),
  '@nodevault/platform.integrations.cloudflare': path.resolve('./integrations/cloudflare/index.ts'),
}

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['**/*.spec.ts'],
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/.output/**', '**/.nuxt/**'],
    projects: [
      {
        resolve: { alias },
        test: {
          name: { label: 'components', color: 'green' },
          include: ['components/**/*.spec.ts'],
          globals: true,
          environment: 'node',
        },
      },
      {
        resolve: { alias },
        test: {
          name: { label: 'api', color: 'blue' },
          include: ['apps/api/**/*.spec.ts'],
          globals: true,
          environment: 'node',
        },
      },
      {
        resolve: { alias },
        test: {
          name: { label: 'nodevault', color: 'magenta' },
          include: ['apps/nodevault/**/*.spec.ts'],
          globals: true,
          environment: 'happy-dom',
        },
      },
    ],
  },
})
