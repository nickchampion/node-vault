import type { IDocumentStore } from 'ravendb'
import { Session } from '@nodevault/platform.components.ravendb'
import {
  EventSource,
} from '@nodevault/platform.components.common'
import { Postgres } from './sql/index.js'

type ContextEvent = (context: Context) => Promise<void> | void

/**
 * function type opassed to context to create get a postgres connection
 * if its needed by the executing code, this allows Lambdas to manage the connection
 * outside the function code to prevent a connection per function execution.
 */
export type PostgresConnection = () => Postgres

/**
 * function type passed to context to create get an IDocumentStore connection
 * if its needed by the executing code, this allows Lambdas to manage the connection
 * outside the function code to prevent a connection per function execution
 */
export type RavenDBConnection = () => IDocumentStore

export interface ContextEvents {
  error: ContextEvent
}

/**
 * Context is the central component to all event and api handlers. We create a new context for
 * each endpoint or event invocation with a new database session which manages all database
 * interaction for the given event.
 *
 * Context is scoped per event and is designed to provide easy and consistent access to
 * entities that provide functionality that cuts across all handlers
 */
export class Context {
  public store: IDocumentStore
  public session: Session
  public event: EventSource
  public user: User
  public props: Record<string, unknown> = {}
  public ravendb: RavenDBConnection

  public constructor(ravendb: RavenDBConnection) {
    this.store = ravendb ? ravendb() : null
    this.session = new Session(this.store)
    this.ravendb = ravendb
  }

  public setEventSource(event: EventSource) {
    this.event = event
    return this
  }

  public setAuthInfo(user: AuthInfo) {
    this.user = user
  }
}
