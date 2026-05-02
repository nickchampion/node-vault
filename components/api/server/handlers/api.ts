import Koa from 'koa'
import { koaBody } from 'koa-body'
import { configuration } from '@nodevault/platform.components.configuration'
import {
  type ApiHandler,
  Context,
  type IApiManifest,
  type IMiddleware,
  EventSource,
  Response,
  middy,
} from '@nodevault/platform.components.context'
import { createDocumentStore } from '@nodevault/platform.components.ravendb'
import { copyFields, sleep, Timer, tryClone } from '@nodevault/platform.components.utils'
import { DocumentStore } from 'ravendb'
import { type ApiDefinition, buildApiDefinitions } from './definition.js'
import multer from '../koa/multer.js'
import compress from 'koa-compress'

export type ApiOptions = {
  port: number
  host: string
  local: boolean
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
      'x-correlation-id',
      'x-authorization-id',
      'x-authorization-refresh',
      'x-organisation-id',
      'x-organisation-name',
      'x-impersonation',
      'x-timezone-offset',
      'x-device-info',
      'x-e2e-database-name',
      'x-version'
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
      'x-api-version'
    ],
    allowOrigin: ['dev', 'local'].includes(configuration.environment.environment) ? '*' : configuration.appHost
  }

  constructor(
    options: ApiOptions,
    api: IApiManifest
  ) {
    this.options = options
    this.middleware = []
    this.api = buildApiDefinitions(api)
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
  async start(kill: boolean = false) {
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
      console.log(`Server listening, port \x1b[33m${this.options.port}\x1b[0m in \x1b[32m${t.stop()}ms\x1b[0m`)

      // this is used locally when verifying bundling of the app to ensure it starts successfully
      if (kill) process.exit(0)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  handleUnhandledRejection = (error: Error) => {
    // handle the error
    console.error(error)

    // exit process in local to raise awareness of this error
    if (configuration.local) {
      console.error('handleUnhandledRejection')
      process.exit(1)
    }
  }

  initialiseDocumentStore = () => {
    // Find the database from the first module (all modules for a given service must use a single database)
    const database = this.api.manifest.database

    // extract all models used by this database
    const models = this.api.manifest.models

    // Create the document store
    this.store = createDocumentStore(database, models)
  }

  /**
   * Handle options requests, should only happen in dev as we proxy via Cloudflare in other
   * environments so we can use the same domain, protocol and port as the front end
   * @param res
   * @returns
   */
  cors = (koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>) => {
    koa.status = 204
    koa.set('access-control-allow-origin', this.settings.allowOrigin)
    koa.set('access-control-allow-credentials', 'true')
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
      path: koa.request.path
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
    let buildEvent: () => EventSource

    try {
      if (koa.method?.toLowerCase() == 'options') {
        this.cors(koa)
        return
      }

      // the server should only not be initialised in local as we have to init all APIs locally
      // which is time consuming and often we'll only use one API between rebuilds
      // this will slow down the first request to each API on local though
      if (!this.api.server.initalized) await this.api.server.init()

      const operation = this.api.server.router.matchOperation(koa.request)

      if (!operation) {
        koa.status = 404
        koa.body = this.notFound(koa, `Operation for given path was not found: ${koa.path}`)
        return
      }

      const queryKeys = Object.keys(koa.request.query)
      const unparsed = Symbol.for('unparsedBody')

      // factory method to build the event for each attempt at invoking the API
      buildEvent = () => {
        const evt = new EventSource({
          query: copyFields(koa.query),
          payload: tryClone(koa.request['body']),
          body: koa.request.body ? koa.request.body[unparsed] : null,
          path: koa.path,
          method: koa.method?.toLowerCase(),
          headers: copyFields(koa.headers),
          type: 'http',
          operation: operation.path,
          version: configuration.version,
          clientVersion: (koa.headers['x-version'] || 'unknown').toString(),
          // files: koa.request['files'] as any as Record<string, FileUpload>,
          pathAndQuery:
            queryKeys.length > 0
              ? `${operation.path}?${queryKeys.map(key => key + '=' + koa.request.query[key]).join('&')}`
              : operation.path
        })

        return evt
      }

      const retries = this.settings.methodsWithRetry.includes(koa.method?.toUpperCase()) ? 3 : 1

      for (let i = 1; i <= retries; i += 1) {
        try {
          await this.tryHandleRoute(buildEvent(), this.api, koa)
          return
        } catch (e: any) {
          if (e.name && e.name === 'ConcurrencyException') {
            if (i === retries) throw e
            await sleep(50) //wait for 50ms and try again
          } else {
            throw e
          }
        }
      }
    } catch (e: any) {
      koa.body = new Response().error(e).body
      koa.status = 500
      koa.set('access-control-allow-origin', this.settings.allowOrigin)
      koa.set('access-control-expose-headers', this.settings.responseHeaders.join(','))
      koa.set('x-api-version', configuration.version)
    }
  }

  /**
   * Handle an API call for a given path.
   * @param event
   * @param res
   * @returns
   */
  tryHandleRoute = async (
    event: EventSource,
    api: ApiDefinition,
    koa: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>
  ): Promise<void> => {
    // base handler which invokes the OpenAPIBackend API, by this point the before middleware components have run
    // so we just pass the request to OpenAPiBackEnd to process authentication, request validation and routing
    const base: ApiHandler = async context => {
      return await api.server.handleRequest(koa.request, context)
    }

    const db = () => this.store!
    const context = new Context(db).setEventSource(event)

    // execute the handler via the middy middleware component this will also deal with any errors raised
    await middy(context, base, this.middleware)

    // set response headers, body and status code
    koa.set('access-control-allow-origin', this.settings.allowOrigin)
    koa.set('x-api-version', configuration.version)
    koa.set('access-control-expose-headers', this.settings.responseHeaders.join(','))

    Object.keys(context.event.response.headers).forEach(header => {
      koa.set(header, context.event.response.headers[header])
    })

    koa.body =
      context.event.response.statusCode === 404
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
          fileSize: 10 * 1024 * 1024
        }
      }).any()
    )

    // parse body
    app.use(
      koaBody({
        multipart: false, // handled by multer middleware above
        includeUnparsed: true
      })
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
 validate = (api: ApiDefinition, evt: EventSource): ValidationError[] => {
    try {
      const validation = api.server.validateRequest(
        {
          headers: evt.headers,
          method: evt.method,
          path: evt.path,
          query: evt.query,
          body: evt.payload
        },
        evt.operation
      )

      return validation.valid ? [] : mapValidationErrors(validation)
    } catch (e) {
      // so we can support executing handlers that are not mapped to an API endpoint during CSV import
      if (e.message === 'Unknown operation') return []
      throw e
    }
  } */
}
