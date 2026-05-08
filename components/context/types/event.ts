import type { FileUpload } from '../../api/server/types/file.js'
import { QuerySettings, QuerySettingsSortBy } from '../../domain/types/search.js'
import type { AuthTokens } from './auth.js'
import { Response } from './response.js'

export type InboundEventType = 'http' | 'event'

/**
 * Representation of an event that triggered whatever code is currently executing
 * Can be an API request or an event
 */
export class InboundEvent {
  public operation: string | undefined
  public path: string | undefined
  public payload?: any
  public pathAndQuery: string | undefined
  public query: Record<string, any> = {}
  public params: Record<string, string | string[]> = {}
  public method: string = 'GET'
  public headers: Record<string, string> = {}
  public response: Response
  public type: InboundEventType = 'http'
  public version: string | undefined
  public clientVersion: string | undefined
  public body: string | undefined // the raw request body, used for cryptographic verification of request bodies
  public files?: Record<string, FileUpload> // set of files uploaded with this request

  constructor(fields?: Partial<InboundEvent>) {
    Object.assign(this, fields)
    this.response = new Response(this.headers)
  }

  public id(): string {
    return (this.params.id as string) || this.query.id || (this.payload ? (this.payload.id as string) : null)
  }

  /**
   * Read paging/sort/filter settings from the inbound query string.
   *
   * The optional `defaults` shallow-merges over the standard defaults; `applyFilters` switches on
   * extracting `f:`-prefixed query params into `settings.filters` so callers can run a fully
   * configured search without parsing the URL themselves.
   */
  public getQuerySettings(defaults?: Partial<QuerySettings>, applyFilters: boolean = false): QuerySettings {
    const limit = Number.parseInt(this.query.limit, 10)
    const offset = Number.parseInt(this.query.offset, 10)

    const settings = new QuerySettings({
      limit: Number.isFinite(limit) ? limit : defaults?.limit ?? 25,
      offset: Number.isFinite(offset) ? offset : defaults?.offset ?? 0,
      sortDesc: this.query.sortDesc === 'true' || defaults?.sortDesc === true,
      count: this.query.count === 'true' || defaults?.count === true,
      startDateISO: this.query.startDateISO ?? defaults?.startDateISO ?? null,
      endDateISO: this.query.endDateISO ?? defaults?.endDateISO ?? null,
    })

    if (this.query.sortBy) {
      const fields = Array.isArray(this.query.sortBy) ? this.query.sortBy : [this.query.sortBy]

      settings.sortBy = fields.map((field: string) => {
        const [fieldName, direction] = field.split(':')

        return new QuerySettingsSortBy({ fieldName, sortDesc: direction === 'desc' })
      })
    } else if (defaults?.sortBy) {
      settings.sortBy = defaults.sortBy
    }

    if (applyFilters) {
      settings.filters = Object.keys(this.query)
        .filter(k => k.startsWith('f:'))
        .reduce<Record<string, string | string[]>>((acc, k) => {
          acc[k.slice(2)] = this.query[k]
          return acc
        }, {})
    }

    return settings
  }

  public getAuthToken(): string | null {
    return InboundEvent.getAuthToken(this.headers)
  }

  public setAuthTokens(tokens: AuthTokens): void {
    this.headers['authorization'] = `Bearer ${tokens.access}`
  }

  static getAuthToken(headers: Record<string, string | string[]>): string | null {
    const auth = headers['authorization'] || headers['Authorization']

    const handleNull = (header: string) => {
      if (header && header.trim().startsWith('null')) return null
      else return header
    }

    return auth ? handleNull(auth.toString().replace('Bearer ', '')) : null
  }
}
