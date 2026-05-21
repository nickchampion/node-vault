import type { ObjectTypeDescriptor } from 'ravendb'
import type { OpenAPIV3 } from 'openapi-types'
import type { Context } from '../context.js'
import type { Response } from '../../api/types/response.js'

/**
 * Signature for API handlers
 */
export type ApiHandler = (context: Context) => Promise<Response>

/**
 * Signature for event handlers
 */
export type EventHandler = (context: Context) => Promise<void>

/**
 * Signature for a middleware function
 */
export type Middleware = (context: Context) => Promise<void>

/**
 * Interface for middleware components
 */
export interface IMiddleware {
  before?: Middleware
  after?: Middleware
  error?: Middleware
}

export interface IApiManifest {
  name: string
  api: Record<string, ApiHandler>
  models: Record<string, ObjectTypeDescriptor>
  indexes: Record<string, ObjectTypeDescriptor>
  document: () => OpenAPIV3.Document
}

export interface IEventsManifest {
  database: string
  name: string
  // events: EventsHandler
  models: Record<string, ObjectTypeDescriptor>
}
