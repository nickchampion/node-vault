import { fileURLToPath } from 'node:url'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig, type NuxtConfig } from 'nuxt/config'

const aliases: Record<string, string> = {}
const dist = 'web'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(<NuxtConfig>{
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

  alias: {
    ...aliases,
    '@trading': fileURLToPath(new URL('app', import.meta.url)),
    '@trading/*': `${fileURLToPath(new URL('app', import.meta.url))}/*`,
  },

  imports: {
    autoImport: true,
  },

  build: {
    sourcemap: true,
  },

  sourcemap: {
    server: true,
    client: 'hidden',
  },

  nitro: {
    routeRules: {
      // This would stop an index.html file from being generated in SPA mode
      // So it only applies to SSR builds
      '/**': { prerender: false },
    },
    preset: 'cloudflare_module',
    node_compat: true,
    externals: {
      inline: ['dayjs'],
    },
    esbuild: {
      target: 'es2022',
    },
  },

  experimental: {
    payloadExtraction: true, // reduces page size
    renderJsonPayloads: true,
  },

  typescript: {
    typeCheck: true,
    strict: false,
  },

  workspaceDir: '../../',

  devtools: {
    enabled: false,
    vscode: {
      reuseExistingServer: true,
      port: 3002,
    },
    timeline: {
      enabled: true,
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 3002,
  },

  runtimeConfig: {
    public: {
      app: 'trading',
      environment: process.env.NUXT_PUBLIC_ENVIRONMENT || '',
      version: process.env.NUXT_PUBLIC_VERSION || '',
      api: '',
      dist: dist,
      sentry: process.env.NUXT_PUBLIC_SENTRY || '',
    },
  },

  vite: {
    plugins: [tailwindcss(), nxViteTsPaths()],
    cacheDir: '../../node_modules/.vite/apps/trading',
    build: {
      sourcemap: true,
      target: 'es2022',
    },
    server: {
      fs: {
        strict: false,
      },
    },
    esbuild: {
      target: 'es2022',
      tsconfigRaw: {
        compilerOptions: {
          skipLibCheck: true,
          noEmit: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        'tailwind-variants',
        'es-toolkit',
        'ua-parser-js',
        'zod'
      ],
    },
  },

  app: {
    pageTransition: { name: 'ui-fade-in', mode: 'out-in' },
    layoutTransition: { name: 'ui-fade-in', mode: 'out-in' },
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
        },
      ],
    },
  },

  components: [{ path: '~/components', pathPrefix: false }],

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/device',
  ],

  /* modules */
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
