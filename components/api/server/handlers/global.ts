import type { Context } from '@nodevault/platform.components.context'
import { AppError } from '@nodevault/platform.components.domain'
import type { OpenAPIBackend, Context as OpenApiContext } from 'openapi-backend'
import type { ValidationError } from '@nodevault/platform.components.api.schemas'

const mapValidationErrors = (validation: { errors?: { path?: string, message?: string }[] | null }): ValidationError[] => {
  return (validation.errors ?? []).map(err => ({
    path: err.path ?? '',
    message: err.message ?? '',
  }))
}

export const registerGlobalHandlers = (api: OpenAPIBackend) => {
  api.register({
    // Global authorization handler, this will be triggered if the
    // security requirements specified in the open api document for the API are not met
    unauthorizedHandler: async (ctx: OpenApiContext, context: Context) => {
      // try to extract the hectare error from the context and use this in the response
      const e = (ctx.security as any)?.jwt?.error ? (ctx.security as any).jwt.error : (ctx as any)['error'] || null

      if (e) {
        const errorCode = e instanceof AppError ? e : new AppError('internal', e.message, 500, e.stack)

        if ((e.code?.name ?? e.name ?? e.code)?.toLowerCase() === 'forbidden') {
          context.event.response.forbidden()
          ;(context.event.response.body as any) = { ...(context.event.response.body as object), errorCode }
        } else {
          context.event.response.unauthorised()
          ;(context.event.response.body as any) = { ...(context.event.response.body as object), errorCode }
        }
      } else {
        context.event.response.unauthorised()
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
      return context.event.response.badRequest(mapValidationErrors(ctx.validation as any))
    },

    /**
     * Any API operation defined in openApi specs but with no handler will hit this
     * notImplemented handler and return a mocked response
     * @param ctx
     * @param context
     * @returns
     */
    notImplemented: (ctx: OpenApiContext, context: Context) => {
      const response = ctx.api.mockResponseForOperation(ctx.operation.operationId ?? '')

      return context.event.response.ok(response.mock)
    },

    /**
     * Global not found handler, this will be triggered if route does not match any operations in the open api document
     * @param ctx
     * @param context
     * @returns
     */
    notFound: async (_ctx: OpenApiContext, context: Context) => context.event.response.notFound(),

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
