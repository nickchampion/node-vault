import { serverConfiguration } from '@nodevault/platform.components.nodevault.server'
import { normalizeError } from '@nodevault/platform.components.domain'
import type { Context } from '../index.js'
import type { IMiddleware } from '../types/index.js'

export const contextMiddleware = (): IMiddleware => {
  const after = async (context: Context): Promise<void> => {
    // dont commit the session if there was an error or bad request
    if (!context || context.error || context.event.response?.statusCode === 400) return

    const setResponseHeaders = () => {
      if (context.event.response?.headers) {
        // Spoof Cloudflare headers in local
        if (serverConfiguration.environment.environment !== 'dev') {
          context.event.response.headers['Cf-Lat'] = '51.75368'
          context.event.response.headers['Cf-Lon'] = '-0.44975'
          context.event.response.headers['Cf-Country'] = 'GB'
          context.event.response.headers['Cf-Timezone'] = 'London/Europe'
        }

        context.event.response.headers['x-elapsed'] = `${Date.now() - +context.props['start']}ms`
      }
    }

    // dont commit the transaction if we're handling an http get request, we should not be changing data on a get
    // things. But allow an override via commitOnGet on the session for exceptional circumstances
    if (context.event.method && context.event.method === 'get' && !context.session.commitOnGet) {
      setResponseHeaders()
      return
    }

    // Some lambdas dont use the database, if its not configured return
    if (!context.session.database) {
      setResponseHeaders()
      return
    }

    // atomic commit of the session
    await context.session.commit()

    setResponseHeaders()
  }

  const before = async (context: Context): Promise<void> => {
    context.props['start'] = Date.now()

    // Bind request-scoped fields onto the logger once. Every log call from the
    // handler (and from the error middleware below) carries them automatically.
    // cf-ray is set by Cloudflare; fall back to x-request-id or a generated id.
    const headers = context.event?.headers ?? {}
    const requestId = headers['cf-ray'] ?? headers['x-request-id'] ?? crypto.randomUUID()

    context.log = context.log.with({
      requestId,
      path: context.event?.path,
      method: context.event?.method,
      ...(context.user?.accountId ? { accountId: context.user.accountId } : {}),
    })
  }

  const error = async (context: Context): Promise<void> => {
    // Wrap the thrown value once so downstream code (response builder, listeners,
    // session error hooks) can rely on AppError shape and stop type-sniffing.
    const err = normalizeError(context.error)

    context.error = err

    // Log every handler error to Workers Logs. Client errors (4xx) at warn,
    // genuine server faults (5xx) at error so they're easy to alert/filter on.
    const level = err.statusCode >= 500 ? 'error' : 'warn'

    context.log[level](`Handler failed: ${err.message}`, err, {
      path: context.event?.path,
      method: context.event?.method,
    })

    // if an error occurs during execution of a handler we may have compensation logic we need to execute.
    // This is often handled in a session commit error event, but this flow does not cater for all use cases
    await context.emit('error')
  }

  return {
    before,
    after,
    error,
  }
}
