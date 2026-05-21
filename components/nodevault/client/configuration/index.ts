import { build, type Environment, type EnvironmentSettings } from '@nodevault/platform.components.configuration'
import type { RuntimeConfig } from 'nuxt/schema'
import { useRuntimeConfig } from 'nuxt/app'
import { clientConfiguration as baseline } from './configuration.js'
import type { ClientConfiguration } from './configuration.js'

let client: ClientConfiguration | null = null

export const useConfig = (config?: RuntimeConfig): ClientConfiguration => {
  config = config ?? useRuntimeConfig()

  const environment: EnvironmentSettings = {
    environment: <Environment>config!.public.environment,
    key: '',
    salt: '',
  }

  if (!client || client.environment !== environment.environment) {
    const built = build<ClientConfiguration>(baseline, environment, {
      extras: {
        environment: environment.environment,
        version: config!.public.version as string,
      },
    })

    client = Object.freeze(built)
  }

  return client
}
