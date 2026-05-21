import type { Environment } from '@nodevault/platform.components.configuration'

export interface ClientConfiguration {
  version: string
  environment: Environment
  platform: {
    api: string
    apiProxy: string
    app: string
    assets: string
  }
  contact: {
    email: string
  }
}

export const clientConfiguration: any = {
  environment: 'env$NUXT_PUBLIC_ENVIRONMENT', // set to the value of NUXT_PUBLIC_ENVIRONMENT env var
  local: 'env$NODE_ENV$development', // will be true if the NODE_ENV env var equals development, otherwise false
  platform: {
    assets: 'https://assets.nodevault.cloud',
    apiProxy: {
      default: 'http://api.nodevault.local:9002',
      prod: 'https://www.nodevault.cloud/api',
    },
    api: {
      default: 'http://api.nodevault.local:9002',
      prod: 'https://api.nodevault.cloud',
    },
    app: {
      default: 'http://www.nodevault.local:9001',
      prod: 'https://www.nodevault.cloud',
    },
  },
  contact: {
    email: 'hello@nodevault.cloud',
  },
}
