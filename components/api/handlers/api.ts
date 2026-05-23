import Koa from 'koa'
import { koaBody } from 'koa-body'
import {
  type ApiHandler,
  Context,
  type IApiManifest,
  type IMiddleware,
  InboundEvent,
  Response,
  middy,
} from '@nodevault/platform.components.context'
import { createDocumentStore } from '@nodevault/platform.components.ravendb'
import { copyFields, sleep, Timer, tryClone } from '@nodevault/platform.components.utils'
import type { openapi } from '@nodevault/platform.components.domain'
import type { DocumentStore } from 'ravendb'
import compress from 'koa-compress'
import multer from '../koa/multer.js'
import { type ApiDefinition, buildApiDefinitions } from './definition.js'

const mapValidationErrors = (validation: { errors?: { path?: string, message?: string }[] | null }): openapi.models.ValidationErrorSchema[] => {
  return (validation.errors ?? []).map(err => ({
    path: err.path ?? '',
    message: err.message ?? '',
  }))
}

export type ApiOptions = {
  port: number
  host?: string
}

/**
 * The purpose of the Api class is to expose the endpoints specified in the modules passed to the constructor
 * We use Koa web server to route incoming requests to the OpenAPIBackend APIs exported by each module
 */
export class Api {
  private options: ApiOptions
  private store: DocumentStore | undefined
  private middleware: IMiddleware[]
  private api: ApiDefinition

  private settings = {
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'HEAD'],
    methodsWithRetry: ['DELETE', 'POST', 'PUT', 'PATCH'],
    redirectStatusCodes: [301, 307],
    headers: [
      'authorization',
      'content-type',
      'accept-version',
      'x-authorization-refresh',
      'x-device-info',
      'x-version',
    ],
    responseHeaders: [
      'cf-lat',
      'cf-lon',
      'cf-country',
      'cf-timezone',
      'content-type',
      'accept-version',
      'cache-control',
      'x-elapsed',
      'x-api-version',
    ],
    allowOrigins: [] as string[],
    version: '',
    environment: 'dev',
  }

  constructor(
    options: ApiOptions,
    api: IApiManifest,
    origins: string[],
    version: string,
    environment: string,
  ) {
    this.options = options
    this.middleware = []
    this.api = buildApiDefinitions(api)
    this.settings.allowOrigins = origins
    this.settings.version = version
    this.settings.environment = environment
  }

  // Access-Control-Allow-Origin must be a single value. Reflect the request
  // Origin back only if it appears in the allowlist; undefined otherwise.
  private resolveOrigin(koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>): string | undefined {
    const origin = koa.get('origin')

    if (!origin) return undefined

    return this.settings.allowOrigins.find(o => o === origin)
  }

  /**
   * Start the api. The start function will take each module manifest supplied and initialise the API and
   * databases required for each module. This approach gives us flexibility over service granularity as
   * it enables us to group one or more modules into a services simply by configuring the server with the modules manifests.
   *
   * Few Notes
   * 1. Databases
   * We create a document store for each unique database name extracted from the manifests provided,
   * this allows us to run an API which contains modules which talk to multiple databases, this is
   * useful for dev environments and reducing costs by grouping APIs into single contains in AWS
   *
   * 2. Middleware
   * By default all handlers get the context and error handling middlewares and api handlers
   * additionally get the isMapper middleware. Any other middleware should be configured on
   * a per module basis by specifying those middleware required on the modules manifest.
   *
   * 3. Routing
   * When a new request hits the API it is initially handled by Koa, below there is a catch
   * all route for all http methods we support. Koa will pass the request to the handleRoute
   * function below which then splits the path and determines which module is needed to handle the request by
   * looking up the module from the first part of the URL path. Once we've identified the module
   * to handle the request we call the module.api.handleRequest method which is an OpenAPIBackend
   * method which will then match the incoming path to a openapi operation specified in the modules OpenAPI document
   */
  async start() {
    try {
      const t = new Timer()

      // create new Koa instance
      const app = new Koa()

      // Create a document store for the database we need access to
      this.initialiseDocumentStore()

      // log unhandled rejections
      if (process.listeners('unhandledRejection').length <= 1) process.on('unhandledRejection', this.handleUnhandledRejection)

      // init OpenAPI Backend and apply middleware
      await this.configure(app)

      // start listening on port
      app.listen(this.options.port, this.options.host)

      // Api has started
      console.log(`Server listening, port \u001B[33m${this.options.port}\u001B[0m in \u001B[32m${t.stop()}ms\u001B[0m`)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  handleUnhandledRejection = (error: Error) => {
    // handle the error
    console.error(error)

    // exit process in local to raise awareness of this error
    if (this.settings.environment === 'dev') {
      console.error('handleUnhandledRejection')
      throw error
    }
  }

  initialiseDocumentStore = () => {
    // Create the document store
    this.store = createDocumentStore(this.api.manifest.models)
  }

  /**
   * Handle options requests, should only happen in dev as we proxy via Cloudflare in other
   * environments so we can use the same domain, protocol and port as the front end
   * @param res
   * @returns
   */
  cors = (koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>) => {
    const origin = this.resolveOrigin(koa)

    koa.status = 204

    if (origin) {
      koa.set('access-control-allow-origin', origin)
      koa.set('access-control-allow-credentials', 'true')
      koa.set('vary', 'Origin')
    }

    koa.set('access-control-allow-methods', this.settings.methods)
    koa.set('access-control-allow-headers', this.settings.headers.join(','))
    koa.set('access-control-expose-headers', this.settings.responseHeaders.join(','))
    koa.set('access-control-max-age', '7200')
    koa.set('content-type', 'text/plain charset=UTF-8')
    koa.set('content-length', '0')
  }

  notFound = (koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>, message: string) => {
    return {
      message,
      method: koa.request.method?.toLowerCase(),
      path: koa.request.path,
    }
  }

  /**
   * Handler for all routes, this method also attempts to deal with concurrency errors from RavenDB.
   * RavenDB does no data locking but uses a mechanism that uses change vectors on a document to control
   * concurrency. If two documents are loaded by 2 deparate processes, with the same change vector
   * and then both processes attempt to update the document, only the first save will succeed, the
   * second will fail with a concurrency error.
   *
   * Here we try to invoke the Api handler up to 3 times if the incoming request is attmpting to
   * save data (post, patch, put & delete). Each failure we clone the incoming event and try again
   *
   * IMPORTANT: We determine which module needs to handle the request by taking the first part of the API path
   * and using that to look up the module name, i.e. /customers/users/1-A will use the customers module to handle the request
   * This implies every module name must be unique and represents the first section of the API path.
   * @param event
   * @param res
   * @returns
   */
  handleRoute = async (koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>): Promise<void> => {
    let buildEvent: () => InboundEvent

    try {
      if (koa.method?.toLowerCase() == 'options') {
        this.cors(koa)
        return
      }

      // the server should only not be initialised in local as we have to init all APIs locally
      // which is time consuming and often we'll only use one API between rebuilds
      // this will slow down the first request to each API on local though
      if (!this.api.server.initalized) await this.api.server.init()

      const operation = this.api.server.router.matchOperation(koa.request as any)

      if (!operation) {
        koa.status = 404
        koa.body = this.notFound(koa, `Operation for given path was not found: ${koa.path}`)
        return
      }

      const queryKeys = Object.keys(koa.request.query)
      const unparsed = Symbol.for('unparsedBody')

      // factory method to build the event for each attempt at invoking the API
      buildEvent = () => {
        const evt = new InboundEvent({
          query: copyFields(koa.query),
          payload: tryClone(koa.request['body']),
          body: koa.request.body ? (koa.request.body as any)[unparsed] : null,
          path: koa.path,
          method: koa.method?.toLowerCase(),
          headers: copyFields(koa.headers),
          type: 'http',
          operation: operation.path,
          version: this.settings.version,
          clientVersion: (koa.headers['x-version'] || 'unknown').toString(),
          // files: koa.request['files'] as any as Record<string, FileUpload>,
          pathAndQuery:
            queryKeys.length > 0
              ? `${operation.path}?${queryKeys.map(key => `${key}=${koa.request.query[key]}`).join('&')}`
              : operation.path,
        })

        return evt
      }

      const retries = this.settings.methodsWithRetry.includes(koa.method?.toUpperCase()) ? 3 : 1

      for (let i = 1; i <= retries; i += 1) {
        try {
          await this.tryHandleRoute(buildEvent(), this.api, koa)
          return
        } catch (error: any) {
          if (error.name && error.name === 'ConcurrencyException') {
            if (i === retries) throw error

            await sleep(50) // wait for 50ms and try again
          } else {
            throw error
          }
        }
      }
    } catch (error: any) {
      const origin = this.resolveOrigin(koa)

      koa.body = new Response().error(error).body
      koa.status = 500

      if (origin) {
        koa.set('access-control-allow-origin', origin)
        koa.set('vary', 'Origin')
      }

      koa.set('access-control-expose-headers', this.settings.responseHeaders.join(','))
      koa.set('x-api-version', this.settings.version ?? '1.0.0')
    }
  }

  /**
   * Handle an API call for a given path.
   * @param event
   * @param res
   * @returns
   */
  tryHandleRoute = async (
    event: InboundEvent,
    api: ApiDefinition,
    koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  ): Promise<void> => {
    // base handler which invokes the OpenAPIBackend API, by this point the before middleware components have run
    // so we just pass the request to OpenAPiBackEnd to process authentication, request validation and routing
    const base: ApiHandler = async (context) => {
      return await api.server.handleRequest(koa.request as any, context)
    }

    const db = () => this.store!
    const context = new Context(db).setEventSource(event)

    // execute the handler via the middy middleware component this will also deal with any errors raised
    await middy(context, base, this.middleware)

    // set response headers, body and status code
    const origin = this.resolveOrigin(koa)

    if (origin) {
      koa.set('access-control-allow-origin', origin)
      koa.set('vary', 'Origin')
    }

    koa.set('x-api-version', this.settings.version ?? '1.0.0')
    koa.set('access-control-expose-headers', this.settings.responseHeaders.join(','))

    Object.keys(context.event.response.headers).forEach((header) => {
      koa.set(header, context.event.response.headers[header])
    })

    koa.body = context.event.response.statusCode === 404
      ? this.notFound(koa, 'Requested resource was not found')
      : context.event.response.body

    if (this.settings.redirectStatusCodes.includes(context.event.response.statusCode)) {
      koa.redirect(context.event.response.headers['location']) // redirect to another page
    }

    koa.status = context.event.response.statusCode || 500
  }

  configure = async (app: Koa) => {
    this.api.server.init()

    // handle multipart-form file uploads
    app.use(
      multer({
        limits: {
          fileSize: 10 * 1024 * 1024,
        },
      }).any() as unknown as Koa.Middleware,
    )

    // parse body
    app.use(
      koaBody({
        multipart: false, // handled by multer middleware above
        includeUnparsed: true,
      }),
    )

    // compress responses
    app.use(compress())

    // default middleware for all routes
    app.use(ctx => this.handleRoute(ctx))
  }

  /* /**
   * Helper function to validate a request with OpenApiBackEnd its referenced on context so
   * we dont need to expose ApiDefinitions
   * @param api
   * @param evt
   * @returns
   */
  validate = (api: ApiDefinition, evt: InboundEvent): openapi.models.ValidationErrorSchema[] => {
    try {
      const validation = api.server.validateRequest(
        {
          headers: evt.headers,
          method: evt.method,
          path: evt.path ?? '',
          query: evt.query,
          body: evt.payload,
        },
        evt.operation,
      )

      return validation.valid ? [] : mapValidationErrors(validation)
    } catch (error) {
      // so we can support executing handlers that are not mapped to an API endpoint during CSV import
      if ((error as Error).message === 'Unknown operation') return []

      throw error
    }
  }
}
