import type { ApiHandler } from '@nodevault/platform.components.context'
import * as authHandlers from './auth/index.js'
import * as commsHandlers from './comms/index.js'
import * as systemHandlers from './system/index.js'

export const apiHandlers: Record<string, ApiHandler> = {
  ...authHandlers,
  ...commsHandlers,
  ...systemHandlers,
}
