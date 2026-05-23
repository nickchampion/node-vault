import type { ApiHandler } from '@nodevault/platform.components.context'
import type { Response } from '@nodevault/platform.components.api'

export const systemPing: ApiHandler = async (context): Promise<Response> => {
  return context.event.response.ok({ status: 'ok' })
}
