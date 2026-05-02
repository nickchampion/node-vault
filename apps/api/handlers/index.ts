import type { ApiHandler } from '@nodevault/platform.components.context'
import * as authHandlers from './auth/index'

export const apiHandlers: Record<string, ApiHandler> = {
  ...authHandlers
}
