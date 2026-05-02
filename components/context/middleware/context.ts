import { Errors, HectareError } from '@nodevault/platform.components.common'
import { Context } from '../index.js'
import type { IMiddleware } from '../types/index.js'
import { configuration } from '@nodevault/platform.components.configuration'

export const contextMiddleware = (): IMiddleware => {
  const after = async (context: Context): Promise<void> => {
    // dont commit the session if there was an error or bad request
    if (!context || context.error || context.event.response?.statusCode === 400) return

    const setResponseHeaders = () => {
      if (context.event.response?.headers) {
        // Spoof Cloudflare headers in local
        if (configuration.local) {
          context.event.response.headers['Cf-Lat'] = '51.75368'
          context.event.response.headers['Cf-Lon'] = '-0.44975'
          context.event.response.headers['Cf-Country'] = 'GB'
          context.event.response.headers['Cf-Timezone'] = 'London/Europe'
        }

        context.event.response.headers['x-log-level'] = context.log.getLogLevel()
        context.event.response.headers['x-elapsed'] = `${new Date().valueOf() - +context.props['start']}ms`
      }
    }

    // dont commit the transaction if we're handling an http get request, we should not be changing data on a get
    // things. But allow an override via commitOnGet on the session for exceptional circumstances
    if (context.event.method && context.event.method === 'get' && !context.session.commitOnGet) {
      setResponseHeaders()
      return
    }

    if (context.user?.readonly && context.event.method !== 'get') {
      throw new HectareError(Errors.Custom('Auth', 'Your account is set to readonly you cannot make any changes', null, 403))
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
    context.props['start'] = new Date().valueOf()
  }

  const error = async (context: Context): Promise<void> => {
    // if an error occurs during execution of a handler we may have compensation logic we need to execute.
    // This is often handled in a session commit error event, but this flow does not cater for all use cases
    await context.emit('error')
  }

  return {
    before,
    after,
    error
  }
}
