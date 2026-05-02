import type { AuthTokens } from './auth.js'
import type { FileUpload } from '../../api/server/types/file.js'
import { Response } from './response.js'

export type EventSourceType = 'http' | 'event'

/**
 * Representation of an event that triggered whatever code is currently executing
 * Can be an API request or an event
 */
export class EventSource {
  public operation: string | undefined
  public path: string | undefined
  public payload?: any
  public pathAndQuery: string | undefined
  public query: Record<string, any> = {}
  public params: Record<string, string | string[]> = {}
  public method: string = 'GET'
  public headers: Record<string, string> = {}
  public response: Response
  public type: EventSourceType = 'http'
  public version: string | undefined
  public clientVersion: string | undefined
  public body: string | undefined // the raw request body, used for cryptographic verification of request bodies
  public files?: Record<string, FileUpload> // set of files uploaded with this request

  constructor(fields?: Partial<EventSource>) {
    Object.assign(this, fields)
    this.response = new Response(this.headers)
  }

  public id(): string {
    return (this.params.id as string) || this.query.id || (this.payload ? (this.payload.id as string) : null)
  }

  public getAuthTokens(): AuthTokens {
    return EventSource.getAuthTokens(this.headers)
  }

  public setAuthTokens(tokens: AuthTokens): void {
    this.headers['authorization'] = `Bearer ${tokens.access}`
    this.headers['x-authorization-refresh'] = `Bearer ${tokens.refresh}`
  }

  static getAuthTokens(headers: Record<string, string | string[]>): AuthTokens {
    const auth = headers['authorization'] || headers['Authorization']
    const refresh = headers['x-authorization-refresh']

    const handleNull = (header: string) => {
      if (header && header.trim().startsWith('null')) return null
      else return header
    }

    return {
      access: auth ? handleNull(auth.toString().replace('Bearer ', '')) : null,
      refresh: refresh ? handleNull(refresh.toString().replace('Bearer ', '')) : null,
      expiresIn: 50000
    }
  }
}
