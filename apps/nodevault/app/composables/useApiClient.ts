import { NodeVaultApiClient } from '@nodevault/platform.components.nodevault.client'

export const useApiClient = (): NodeVaultApiClient => {
  const auth = useAuthStore()

  return new NodeVaultApiClient(auth.apiOptions())
}
