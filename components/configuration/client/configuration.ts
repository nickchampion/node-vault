/**
 * NOTES:
 * Resolves config per environment and app
 *
 * 1. You can set a property to a primative value and this will be the same across all environments
 * 2. You can set a value per environment by setting the configuration property to an object, the object MUST contain a default key
 * which is the default value if no environment specific key is set. Provide an environment key to set a value per environment
 * as per the platform.api property
 * 3. If you have app spelcific config the properties object should contain the app name as a key then the value (for all environments)
 * or the environments object with deafult key
 * 4. Load a value from an env var by using the env$ prefix, this will read the value from process.env
 */

import type { Environment } from '@nodevault/platform.components.configuration.core'

export interface ClientConfiguration {
  version: string
  environment: Environment
  dist: string
  app: string
  local: boolean
  platform: {
    api: string
    apiProxy: string
    assets: string
  }
}

export const clientConfiguration: any = {
  environment: 'env$NUXT_PUBLIC_ENVIRONMENT', // set to the value of NUXT_PUBLIC_ENVIRONMENT env var
  local: 'env$NODE_ENV$development', // will be true if the NODE_ENV env var equals development, otherwise false
  dist: 'env$NUXT_PUBLIC_DIST',
  platform: {
    assets: 'https://assets.nodevault.com',
    apiProxy: {
      prod: 'https://app.nodevault.com/api',
    },
    api: {
      prod: 'https://api.nodevault.cloud',
    },
  },
}
