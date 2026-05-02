import { Context } from './index.js'
import type { EventHandler, ApiHandler, IMiddleware, Middleware } from './types/index.js'
import { contextMiddleware } from './middleware/index.js'
import { configuration } from '@nodevault/platform.components.configuration'

/**
 * Component to handle executing an API or Event handler and wrapping the call with any configured middleware components.
 * @param context
 * @param handler
 * @param rethrowError
 * @param middleware
 * @returns
 */
export const middy = async (
  context: Context,
  handler: ApiHandler | EventHandler,
  middleware?: IMiddleware[]
): Promise<Context> => {
  let wrapper = configure(handler).use(contextMiddleware())

  // set up any middleware passed in by the service
  middleware?.forEach(m => {
    wrapper = wrapper.use(m)
  })

  // run the handler
  await wrapper(context)
  return context
}

const configure = (baseHandler: ApiHandler | EventHandler) => {
  const before: Middleware[] = []
  const after: Middleware[] = []
  const error: Middleware[] = []

  const instance = async (context: Context) => {
    return await execute(context, before, baseHandler, after, error)
  }

  instance.use = (middleware: IMiddleware) => {
    const { before, after, error } = middleware

    if (!before && !after && !error) {
      throw new Error("Errors.Platform.InvalidMiddleware")
    }

    if (before) instance.before(before)
    if (after) instance.after(after)
    if (error) instance.error(error)

    return instance
  }

  // Inline Middlewares
  instance.before = (fn: Middleware) => {
    before.push(fn)
    return instance
  }
  instance.after = (fn: Middleware) => {
    after.unshift(fn)
    return instance
  }
  instance.error = (fn: Middleware) => {
    error.push(fn)
    return instance
  }

  return instance
}

const execute = async (
  context: Context,
  before: Middleware[],
  baseHandler: ApiHandler | EventHandler,
  after: Middleware[],
  error: Middleware[]
) => {
  try {
    await run(context, before)
    await baseHandler(context)
    await run(context, after)
  } catch (e) {
    try {
      context.error = e
      await run(context, error)
    } catch (ex) {
      ex.context = context
      throw ex
    } finally {
      // set the response based on the error raised
      context.event.response.error(context.error, configuration.production)
    }
  }
}

const run = async (context: Context, functions: Middleware[]) => {
  for (const fn of functions) {
    await fn(context)
  }
}
