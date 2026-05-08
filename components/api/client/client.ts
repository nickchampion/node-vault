import {
  ApiResponseWrapper,
  type ApiResponse,
  type ApiOptions,
  type ApiRequestOptions,
  type AuthTokens,
  type QueryParams,
} from './types.js'

const fields = new Set(['limit', 'offset', 'sortBy', 'page'])

export class ApiClient {
  baseUri: string
  options: ApiOptions

  constructor(options: ApiOptions) {
    this.baseUri = options.baseUri
    this.options = options ?? null
  }

  fullyQualifiedUri = (path: string) => {
    return `${this.baseUri}${path.startsWith('/') ? path : `/${path}`}`
  }

  replacePath = (url: string, path: string): string => {
    return `${path}?${url.split('?')[1] ?? ''}`
  }

  buildQuery = <T extends QueryParams>(url: string, query: T): string => {
    const q = { limit: 24, page: 1, ...query }

    const params = new URLSearchParams({
      limit: q.limit.toString(),
      offset: (q.offset ?? (q.page - 1) * q.limit).toString(),
      sortBy: q.sortBy ?? 'createdAtUTC_desc',
    })

    Object.keys(query)
      .filter(k => !fields.has(k) && !!(query as Record<string, any>)[k])
      .forEach((key) => {
        const paramKey = key.startsWith('f_') ? key.replace('f_', 'f:') : key

        params.append(paramKey, (query as Record<string, any>)[key])
      })

    return `${url}?${params.toString()}`
  }

  buildQueryNoPaging = <T extends Record<string, string>>(url: string, query: T): string => {
    const params = new URLSearchParams(query)

    return `${url}?${params.toString()}`
  }

  shouldAttemptReauth = <T>(wrapper: ApiResponseWrapper<T>, request: ApiRequestOptions): boolean => {
    return (wrapper.status === 401 && (request.reauth == null || request.reauth))// || wrapper.status === 400 && wrapper.errors.first()
  }

  invoke = async <T>(request: ApiRequestOptions): Promise<ApiResponse<T>> => {
    this.applyPathParams(request)

    let wrapper = await this.invokeImpl<T>(request, this.options.tokens)

    // handle expired token, call the refresh endpoint and retry the request with new tokens
    if (this.shouldAttemptReauth(wrapper, request) && this.options.reauth) {
      this.options = await this.options.reauth()

      wrapper = await this.invokeImpl<T>(request, this.options.tokens)
    }

    const response = wrapper.unwrap()

    return response
  }

  private applyPathParams = (request: ApiRequestOptions) => {
    if (!request.params) return

    Object.keys(request.params).forEach((key) => {
      request.path = request.path!.replace(`:${key}`, request.params![key].toString())
    })
  }

  private invokeImpl = async <T>(
    request: ApiRequestOptions,
    tokens: AuthTokens | undefined,
  ): Promise<ApiResponseWrapper<T>> => {
    try {
      // Use $fetch.raw to get access to all response headers
      const response = await $fetch.raw<T>(`${this.baseUri}${request.path}`, {
        method: request.method,
        body: request.method === 'GET' ? undefined : request.body,
        query: request.query,
        credentials: 'omit',
        headers: this.createRequestHeaders(request, tokens),
      })

      return new ApiResponseWrapper<T>(response._data as T, response.status, request.path!, response.headers)
    } catch (error: any) {
      return new ApiResponseWrapper<T>(
        error.response?._data ?? { message: 'Network error', status: '503' },
        error.response?.status ?? 503,
        request.path!,
        error.response?.headers ?? new Headers(),
      )
    }
  }

  createRequestHeaders = (request: ApiRequestOptions, tokens: AuthTokens | undefined) => {
    return {
      ...request.headers,
      'Content-Type': 'application/json',
      'x-device-info': this.options.device,
      'x-version': this.options.version,
      ...(tokens?.access && {
        authorization: `Bearer ${tokens.access}`,
      }),
    }
  }
}
