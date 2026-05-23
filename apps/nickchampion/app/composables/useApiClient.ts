import { NodeVaultApiClient } from '@nodevault/platform.components.nodevault.client'
import { isCloudflareWorker } from '@nodevault/platform.components.utils'

export const useApiClient = (): NodeVaultApiClient => {
  const config = useConfig()

  return new NodeVaultApiClient({
    baseUri: isCloudflareWorker() ? config.platform.api : config.platform.apiProxyNc,
    device: 'web',
    version: config.version,
  })
}
