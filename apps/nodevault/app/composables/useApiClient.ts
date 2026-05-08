import { NodeVaultApiClient } from '@nodevault/platform.components.api.client'

export const useApiClient = (): NodeVaultApiClient => {
  const auth = useAuthStore()

  return new NodeVaultApiClient(auth.apiOptions())
}
