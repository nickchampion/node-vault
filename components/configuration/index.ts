import type { RuntimeConfig } from 'nuxt/schema'
import { buildServer, buildClient } from './builder'
import type { Environment, ServerConfiguration, ClientConfiguration } from './types'

let client: ClientConfiguration | null

export const useConfig = (config?: RuntimeConfig): ClientConfiguration | null => {
  config = config ?? useRuntimeConfig()

  if (!client || client.environment !== config!.public.environment) {
    client = build(
      <Environment>config!.public.environment,
      config!.public.version as string,
      config!.public.app as string,
      config!.public.api as string,
      config!.public.dist as string,
    )
  }

  return client
}

export const server = builder.cached()

export type { ServerConfiguration, ClientConfiguration, Environment } from './types'
