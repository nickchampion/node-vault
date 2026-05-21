import type { ApiClient } from './client'

export class AccountApi {
  private client: ApiClient

  constructor(apiClient: ApiClient) {
    this.client = apiClient
  }
}
