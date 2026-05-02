import type { Facets, StandardResponse, SearchResults } from '@nodevault/platform.clients.common'
import type { ILogger } from '@nodevault/platform.libs.services'
import { ValidationErrors } from '@nodevault/platform.libs.types'

export type Facet = Facets
export type FacetTerm = NonNullable<Facets['terms']>[number]
export type Aggregation = NonNullable<FacetTerm['aggregations']>[keyof NonNullable<FacetTerm['aggregations']>]
export type ErrorsBySection = Record<string, Record<string, string>>
export type ApiFunction = <T>(url: string, options: ApiRequestOptions) => Promise<ApiResponse<T>>

export type ApiSearchResults<T> = Omit<SearchResults, 'docs'> & {
  docs: Array<T>
}

export interface LocationHeaders {
  latitude: number
  longitude: number
  country: string
  timezone: string
}

export interface AuthTokens {
  access: string | null
  refresh: string | null
  id: string | null
  expiresIn?: number | null
}

export interface PagingParams {
  pageSize: number
  pageNumber: number
  totalItems: number
  pageCount: number
  pageStart: number
  pageEnd: number
}

export interface QueryParams {
  limit?: number
  offset?: number
  page?: number
  sortBy?: string
}

export interface ApiRequestOptions {
  path?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: BodyInit | null
  query?: Record<string, string | number | boolean>
  facets?: Record<string, string | number | boolean>
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  reauth?: boolean
}

export interface ApiOptions {
  baseUri: string
  impersonation?: string | null
  tokens?: AuthTokens
  reauth?: () => Promise<ApiOptions>
  device: string
  sentry: ILogger
  version: string
}

export type ApiResponse<T> = {
  data: T | null
  error: StandardResponse | null
  errors: ValidationErrors
  headers: Record<string, string>
  success: boolean
  status: 'ok' | 'error' | 'validation' | 'conflict'
  maintenance: boolean
  url: string
  location: LocationHeaders
  elapsed: number
}

export const createApiResponse = (message: string, status: number, field?: string): ApiResponse<StandardResponse> => {
  const response: StandardResponse = {
    message: message,
    validation: field ? [{ path: field, message: `${field} is a required field` }] : undefined,
    status: String(status),
  }

  return new ApiResponseWrapper<StandardResponse>(response, status, location?.href).unwrap()
}

export class ApiResponseWrapper<T> {
  url: string
  data: T | StandardResponse
  errors: ValidationErrors
  headers: Record<string, string> = {}
  serverError: string | null = null
  status: number

  constructor(data: T | StandardResponse, status: number, url: string, responseHeaders?: Headers) {
    this.data = data
    this.status = status
    this.headers = responseHeaders ? Object.fromEntries(responseHeaders.entries()) : {}
    this.url = url
    this.errors = new ValidationErrors()
    this.setErrors()
  }

  unwrap(): ApiResponse<T> {
    return {
      data: this.success() ? this.data : null,
      error: this.success() ? null : this.data as StandardResponse,
      errors: this.errors,
      status: this.success() ? 'ok' : this.validation() ? 'validation' : this.conflict() ? 'conflict' : 'error',
      success: this.success(),
      headers: this.headers,
      maintenance: this.headers['x-maintenance-mode'] === 'true',
      url: this.url,
      location: {
        latitude: this.headers['cf-lat'] ? Number.parseFloat(this.headers['cf-lat']) : 0,
        longitude: this.headers['cf-lon'] ? Number.parseFloat(this.headers['cf-lon']) : 0,
        country: this.headers['cf-country'] || '',
        timezone: this.headers['cf-timezone'] || '',
      },
      elapsed: this.headers['x-elapsed'] ? Number.parseFloat(this.headers['x-elapsed']) : 0,
    }
  }

  success(): this is { data: T } {
    return this.status >= 200 && this.status < 300
  }

  error(): this is { data: StandardResponse } {
    return this.status >= 500
  }

  validation(): this is { data: StandardResponse } {
    return this.status >= 400 && this.status < 500
  }

  conflict(): this is { data: StandardResponse } {
    return this.status === 409
  }

  private setErrors = () => {
    if (this.conflict() || this.error()) {
      this.errors.set('general', [this.data.message!])
      return
    }

    if (this.validation()) {
      this.data.validation?.forEach((err) => {
        const fieldKeys = err.message?.match(/'([^']+)'/g)

        if (fieldKeys && fieldKeys.length === 2) {
          const key = `${err.path}.${fieldKeys[1].replaceAll('\'', '')}`

          this.errors.set(key, [`${key} is a required field`])
        } else {
          this.errors.set(err.path!, [err.message!])
        }
      })
    }
  }
}
