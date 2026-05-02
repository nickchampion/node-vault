import { Errors, HectareError } from '@nodevault/platform.components.common'
import { configuration } from '@nodevault/platform.components.configuration'
import { Context } from '@nodevault/platform.components.context'
import { type Context as OpenApiContext, OpenAPIBackend } from 'openapi-backend'
import { mapValidationErrors } from '../utils.js'

export const registerGlobalHandlers = (api: OpenAPIBackend) => {
  api.register({
    // Global authorization handler, this will be triggered if the
    // security requirements specified in the open api document for the API are not met
    unauthorizedHandler: async (ctx: OpenApiContext, context: Context) => {
      // try to extract the hectare error from the context and use this in the response
      const e = ctx.security?.jwt?.error ? ctx.security?.jwt?.error : ctx['error'] || null

      if (e) {
        const errorCode = e instanceof HectareError ? e : Errors.Custom(e.name, e.message, e.stack)

        if ((e.code?.name ?? e.name ?? e.code)?.toLowerCase() === 'forbidden') {
          context.event.response.forbidden(errorCode)
        } else {
          context.event.response.unauthorised(errorCode, configuration.production, context.event.headers)
        }
      } else {
        context.event.response.unauthorised(Errors.Auth.Unauthorised, configuration.production, context.event.headers)
      }
    },

    /**
     * Global validation handler, this will be triggered if the rqeuest
     * body does not satisfy the schema requirements from the open api document
     * @param ctx
     * @param context
     * @returns
     */
    validationFail: async (ctx: OpenApiContext, context: Context) => {
      return context.event.response.badRequest(mapValidationErrors(ctx.validation))
    },

    /**
     * Any API operation defined in openApi specs but with no handler will hit this
     * notImplemented handler and return a mocked response
     * @param ctx
     * @param context
     * @returns
     */
    notImplemented: (ctx: OpenApiContext, context: Context) => {
      const response = ctx.api.mockResponseForOperation(ctx.operation.operationId)
      return context.event.response.ok(response.mock)
    },

    /**
     * Global not found handler, this will be triggered if route does not match any operations in the open api document
     * @param ctx
     * @param context
     * @returns
     */
    notFound: async (ctx: OpenApiContext, context: Context) => context.event.response.notFound()

    // /**
    //  * Validate response schema
    //  * @param ctx
    //  * @param context
    //  * @returns
    //  */
    // postResponseHandler: async (ctx: OpenApiContext, context: Context) => {
    //   // const valid = ctx.api.validateResponse(context.event.response.body, ctx.operation)

    //   // if (valid.errors) {
    //   //   return context.event.response.badRequest(mapValidationErrors(ctx.validation))
    //   // }

    //   return context.event.response
    // }
  })
}
