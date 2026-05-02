import { createMD5Hash } from '@nodevault/platform.components.utils'
import type { StandardResponse, ValidationError } from '@nodevault/platform.components.api.schemas'
import { FileContent } from '../../api/server/types/file.js'

export type ResponseValue = string | object

/**
 * Class that represents an API response. An instance is created when we create a new instance of Context so API handlers
 * can easily control whats returned to clients.
 */
export class Response {
  headers: Record<string, string>
  body: ResponseValue | null = null
  streaming: boolean = false
  statusCode: number = 200
  requestHeaders: Record<string, string> = {}
  isInternalRequest: boolean = false

  constructor(headers?: Record<string, string>) {
    // store the request headers as we sometimes need these to control the response
    this.requestHeaders = headers ?? {}
    this.headers = {}
    // default to JSON
    this.headers['content-type'] = 'application/json; charset=utf-8'
    // default to no caching
    this.headers['cache-control'] = 'no-store'
  }

  /**
   * Allows the response to be cached in public or private cache for the number of seconds specified
   * @param seconds
   */
  cacheFor(seconds: number) {
    // - public means the response can be cached in public caches even if the request has an authorisation header present
    // - max-age is the period of time in seconds the response is considered fresh
    // - must-revalidate informs the client that the response must be revalidated by the server if its no longer fresh
    //   which allows us to support conditional get requests
    this.headers['cache-control'] = `public, max-age=${seconds}, must-revalidate`
    return this
  }

  /**
   * Generate an eTag for caching, some API responses can be cached in CDNs & private caches. If we allow this for a given
   * response we would usually want to support conditional get requests to reduce bandwidth and improve performance
   * This function compares the incoming eTag via the If-None-Match header and returns 304 if the content has not changed
   * @returns
   */
  conditional() {
    if (!this.body) throw new Error('Invalid conditional request')

    const eTag = createMD5Hash(JSON.stringify(this.body))
    const requestETag = this.requestHeaders['if-none-match'] || null

    this.headers['etag'] = eTag

    // basically means if the eTag from the request headers matches the current
    // response body hash then the cache (public or private)
    // has the latest version of the content and we can return 403 not modified with no body
    if (eTag === requestETag) {
      this.body = null
      this.statusCode = 304
    }

    return this
  }

  bodyAs<T extends ResponseValue>(): T | null {
    return this.body ? (this.body as T) : null
  }

  /**
   * Return a stream in the response and set the appropriate headers to allow the file to download
   * @param stream
   * @param filename
   * @param contentType
   * @returns
   */
  stream(file: FileContent): Response {
    this.statusCode = 200
    this.body = file.content
    this.streaming = true
    this.headers['content-type'] = file.contentType ?? ''
    this.headers['access-control-expose-headers'] = 'Content-Disposition'
    this.headers['content-disposition'] = `attachment; filename=${file.name}`

    if (file.metadata) {
      Object.keys(file.metadata)
        .filter(key => file.metadata[key] !== undefined)
        .forEach(key => {
          this.headers[`x-file-metadata-${key.toLowerCase()}`] = file.metadata[key]
        })
    }

    return this
  }

  ok(body?: ResponseValue): Response {
    body = body ?? { status: 200, message: 'ok' }

    this.statusCode = 200
    this.body = typeof body === 'string' ? this.buildResponse('ok', body) : body
    return this
  }

  okRaw(body?: ResponseValue): Response {
    body = body ?? { status: 200, message: 'ok' }

    this.statusCode = 200
    this.body = body
    return this
  }

  created(body?: ResponseValue): Response {
    this.statusCode = 201
    this.body = body ?? null
    return this
  }

  notFound(): Response {
    this.statusCode = 404
    return this
  }

  redirect(url: string, status: 301 | 307): Response {
    this.statusCode = status
    this.headers['location'] = url
    return this
  }

  /**
   * Custom 400 response and message
   * @param path path to the field on the object that triggered the validation error
   * @param message custom validation message
   * @param statusCode Http status code, defaults to 400
   * @returns
   */
  badRequestCustom(path: string, message: string, statusCode = 400, data: any = null, code?: string): Response {
    this.statusCode = statusCode
    this.body = this.buildValidationResponse(
      [
        {
          path: path,
          message: message,
          data
        }
      ],
      undefined,
      code
    )
    return this
  }

  /**
   * Process validation errors from OpenAPI schema validation
   * @param validationResult
   * @returns
   */
  badRequest(validationResults: ValidationError[]): Response {
    this.statusCode = 400
    this.body = this.buildValidationResponse(validationResults)
    return this
  }

  /**
   * Use this response if the user has no auth token or the token is expired
   * @param message
   * @returns
   */
  unauthorised(): Response {
    this.statusCode = 401
    this.body = this.buildResponse(
      code.statusCode == 440 ? 'Login Time-out' : 'Unauthorised',
      code.message,
      production ? undefined : error?.stack || undefined,
      code.name,
      body
    )

    return this
  }

  forbidden(error?: Error): Response {
    this.statusCode = 403
    this.body = this.buildResponse('forbidden', 'You do not have access to this resource')
    return this
  }

  error(error: Error): Response {
    this.statusCode = 500
    this.body = this.buildResponse(
      'error',
      "An unexpected error has occurred",
    )
    return this
  }

  buildResponse(
    status: string,
    message: string,
    stack: string | undefined = undefined,
    code: string | undefined = undefined,
    body: any = undefined
  ): StandardResponse {
    return {
      status,
      message,
      stack,
      code,
      body
    }
  }

  buildValidationResponse(
    validation: ValidationError[] = [],
    stack: string | undefined = undefined,
    code: string = 'ValidationError'
  ): StandardResponse {
    return {
      status: 'validation',
      message: 'One or more validation errors have occurred',
      validation,
      stack,
      code
    }
  }
}
