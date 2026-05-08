import type { RegisterRequestSchema, StandardResponse, VerifyLoginSchema } from '@nodevault/platform.components.api.schemas'
import type { ApiClient } from '../client'
import type { ApiResponse } from '../types'

export class AuthApi {
  private client: ApiClient

  constructor(apiClient: ApiClient) {
    this.client = apiClient
  }

  public login = async (email: string): Promise<ApiResponse<StandardResponse>> => {
    return this.client.invoke({
      path: '/auth/login',
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
    })
  }

  public register = async (payload: RegisterRequestSchema): Promise<ApiResponse<VerifyLoginSchema>> => {
    return this.client.invoke({
      path: '/auth/register',
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  public verify = async (code: string): Promise<ApiResponse<VerifyLoginSchema>> => {
    return this.client.invoke({
      path: '/auth/verify',
      method: 'POST',
      body: JSON.stringify({
        code: code,
      }),
    })
  }
}
