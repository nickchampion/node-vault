import type { Context as OpenAPIContext } from 'openapi-backend'
import { Context, type ApiHandler } from '@nodevault/platform.components.context'
import { AuthInfo } from '@nodevault/platform.components.common'
import { authoriseUser } from './security.js'

/**
 * OpenAPI Handler signature
 */
export type OpenApiHandler = (c: OpenAPIContext, context: Context) => Promise<unknown>

/**
 * This is used to decorate all API handlers, take what we need from the OpenAPIBackEnd
 * context and only pass our own context object down to the api handlers in our modules.
 * This keeps a consistent API and abstracts any infrastructure detail from our modules
 * @param handler
 * @returns
 */
const wrap = (handler: ApiHandler) => async (c: OpenAPIContext, context: Context) => {
  // read the parsed path parameters
  context.event.params = c.request.params

  // set up the context.user which has been constructed in the `security` handler
  context.user = (c.security.jwt as AuthInfo) ?? null

  if (!context.user) {
    context.user = (await authoriseUser(c, false)) ?? new AuthInfo()
  }

  context.user.authorised = c.security.authorized

  // execute the handler
  return await handler(context)
}

export const wrapHandlersWithContextSignature = (handlers: Record<string, ApiHandler>): Record<string, OpenApiHandler> => {
  const r: Record<string, OpenApiHandler> = {}
  Object.keys(handlers).forEach(key => {
    r[key] = wrap(handlers[key])
  })
  return r
}
