import type { ApiHandler } from '@nodevault/platform.components.context'
import * as authHandlers from './auth/index.js'
import * as commsHandlers from './comms/index.js'

export const apiHandlers: Record<string, ApiHandler> = {
  ...authHandlers,
  ...commsHandlers,
}
