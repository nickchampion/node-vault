import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig, type NuxtConfig } from 'nuxt/config'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

const { resolve, dirname } = path

// Derive workspace root (two levels up from apps/nodevault/)
const __dirname = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(__dirname, '../../')

// Convert tsconfig path aliases into Nitro aliases so server routes can
// import workspace packages the same way Vite (frontend) can.
const tsconfig = JSON.parse(readFileSync(resolve(workspaceRoot, 'tsconfig.json'), 'utf8'))
const nitroAliases: Record<string, string> = Object.fromEntries(
  Object.entries<string[]>(tsconfig.compilerOptions.paths).map(([alias, [path]]) => [
    alias,
    resolve(workspaceRoot, path),
  ]),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(<NuxtConfig>{
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

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
    alias: nitroAliases,
    routeRules: {
      // This would stop an index.html file from being generated in SPA mode
      // So it only applies to SSR builds
      '/**': { prerender: false },
    },
    preset: 'cloudflare_module',
    esbuild: {
      target: 'es2022',
    },
  },

  experimental: {
    payloadExtraction: true, // reduces page size
    renderJsonPayloads: true,
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },

  workspaceDir: '../../',

  devtools: {
    enabled: false,
    vscode: {
      reuseExistingServer: true,
      port: 9001,
    },
    timeline: {
      enabled: true,
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 9001,
  },

  runtimeConfig: {
    public: {
      environment: process.env.NUXT_PUBLIC_ENVIRONMENT || '',
      version: process.env.NUXT_PUBLIC_VERSION || '',
      // PostHog — omit key when env var is unset so the plugin skips init
      posthogPublicKey: process.env.NUXT_PUBLIC_POSTHOG || '',
      posthogClientConfig: {
        capture_exceptions: true,
        opt_out_capturing_by_default: process.env.NUXT_PUBLIC_ENVIRONMENT !== 'prod',
      },
    },
  },

  vite: {
    plugins: [nxViteTsPaths()],
    cacheDir: '../../node_modules/.vite/apps/nodevault',
    build: {
      sourcemap: true,
      target: 'es2022',
    },
    server: {
      fs: {
        strict: false,
      },
      allowedHosts: [
        'www.nodevault.local',
        'www.nodevault.cloud',
      ],
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
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/device',
  ],

  /* modules */
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // Cloudflare Workers has no filesystem access, so the default server-side
  // icon handler 404s in production. Scan all components at build time and
  // bundle every icon that's actually used into the client — no runtime fetch.
  icon: {
    serverBundle: false,
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
    },
  },
})
