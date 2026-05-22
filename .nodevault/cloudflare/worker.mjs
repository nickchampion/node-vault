const patchEventTargets = () => {
  const prototypes = [
    EventTarget.prototype,
    // eslint-disable-next-line no-undef
    ServiceWorkerGlobalScope.prototype,
  ].filter(Boolean)

  for (const proto of prototypes) {
    const original = proto.addEventListener

    proto.addEventListener = function (type, listener, options) {
      if (typeof options === 'boolean' && options === true) {
        options = false
      }
      else if (typeof options === 'object' && options.capture === true) {
        options.capture = false
      }

      return original.call(this, type, listener, options)
    }
  }
}

patchEventTargets()

// eslint-disable-next-line import/first
import * as worker from './index.mjs'

const isAllowedOrigin = (origin) => {
  return /^https?:\/\/([a-zA-Z0-9-]+\.)*nodevault\.cloud(:\d+)?$/.test(origin)
    || /^https?:\/\/([a-zA-Z0-9-]+\.)*nickchampion\.me(:\d+)?$/.test(origin)
    || /^https?:\/\/localhost(:\d+)?$/.test(origin)
    || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
    || /^https?:\/\/192\.168\.0\.\d+(:\d+)?$/.test(origin)
}

const exposeHeaders = 'cf-lat,cf-lon,cf-country,cf-timezone,content-type,accept-version,cache-control,x-elapsed,x-version'

export default {
  async fetch(request, environment, context) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      context.passThroughOnException()

      const origin = request.headers.get('Origin') || ''

      const corsOrigin = isAllowedOrigin(origin)
        ? origin
        : 'https://www.nodevault.cloud'

      if (request.method.toUpperCase() === 'OPTIONS') {
        return new Response(undefined, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Expose-Headers': exposeHeaders,
            'Vary': 'Origin',
          },
        })
      }

      const upstreamPath = url.pathname.replace(/^\/api/, '')
      const endpoint = `https://api.nodevault.cloud${upstreamPath}${url.search}`
      const headers = new Headers(request.headers)

      headers.delete('cookie')
      headers.delete('host')
      headers.delete('content-length')

      const upstream = await fetch(endpoint, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      })

      const responseHeaders = new Headers(upstream.headers)

      if (request.cf) {
        if (request.cf.latitude) responseHeaders.set('Cf-Lat', request.cf.latitude.toString())
        if (request.cf.longitude) responseHeaders.set('Cf-Lon', request.cf.longitude.toString())
        if (request.cf.country) responseHeaders.set('Cf-Country', request.cf.country)
        if (request.cf.timezone) responseHeaders.set('Cf-Timezone', request.cf.timezone)
      }

      responseHeaders.set('Access-Control-Allow-Origin', corsOrigin)
      responseHeaders.set('Access-Control-Allow-Methods', '*')
      responseHeaders.set('Access-Control-Allow-Headers', '*')
      responseHeaders.set('Access-Control-Expose-Headers', exposeHeaders)
      responseHeaders.set('Vary', 'Origin')

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      })
    }

    return worker.default.fetch(request, environment, context)
  },
}
