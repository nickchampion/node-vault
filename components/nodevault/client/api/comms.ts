import type { ContactRequestSchema } from '@nodevault/platform.components.nodevault.openapi'
import type { openapi } from '@nodevault/platform.components.domain'
import type { ApiClient } from './client'
import type { ApiResponse } from './types'

export class CommsApi {
  private client: ApiClient

  constructor(apiClient: ApiClient) {
    this.client = apiClient
  }

  public contact = async (payload: ContactRequestSchema): Promise<ApiResponse<openapi.models.StandardResponseSchema>> => {
    return this.client.invoke({
      path: '/comms/contact',
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}
