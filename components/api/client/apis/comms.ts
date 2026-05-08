import type { ContactRequestSchema, StandardResponse } from '@nodevault/platform.components.api.schemas'
import type { ApiClient } from '../client'
import type { ApiResponse } from '../types'

export class CommsApi {
  private client: ApiClient

  constructor(apiClient: ApiClient) {
    this.client = apiClient
  }

  public contact = async (payload: ContactRequestSchema): Promise<ApiResponse<StandardResponse>> => {
    return this.client.invoke({
      path: '/comms/contact',
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}
