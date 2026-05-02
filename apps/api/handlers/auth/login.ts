import type { ApiHandler } from '@nodevault/platform.components.context'
import { Response } from '@nodevault/platform.components.api.server'

export const authLogin: ApiHandler = async (context): Promise<Response> => {
  return context.event.response.ok()
}
