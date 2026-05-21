import path from 'node:path'
import { defineConfig } from 'vitest/config'

const alias = {
  '@nodevault/platform.apps.api': path.resolve('./apps/api/index.ts'),
  '@nodevault/platform.apps.nodevault': path.resolve('./apps/nodevault/index.ts'),
  '@nodevault/platform.apps.nickchampion': path.resolve('./apps/nickchampion/index.ts'),
  '@nodevault/platform.components.api': path.resolve('./components/api/index.ts'),
  '@nodevault/platform.components.nodevault.server': path.resolve('./components/nodevault/server/index.ts'),
  '@nodevault/platform.components.nodevault.client': path.resolve('./components/nodevault/client/index.ts'),
  '@nodevault/platform.components.nodevault.openapi': path.resolve('./components/nodevault/openapi/index.ts'),
  '@nodevault/platform.components.configuration': path.resolve('./components/configuration/index.ts'),
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
