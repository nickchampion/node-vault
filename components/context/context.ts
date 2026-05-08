import type { IDocumentStore } from 'ravendb'
import { Session } from '@nodevault/platform.components.ravendb'
import type { AppError } from '@nodevault/platform.components.domain'
import { InboundEvent } from './types/event.js'
import { Log, type LogLevel } from './log.js'
import type { AuthInfo } from './types/auth.js'

type ContextEvent = (context: Context) => Promise<void> | void

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
  public event: InboundEvent
  public user: AuthInfo | undefined
  public authorised: boolean = false
  public props: Record<string, any> = {}
  public ravendb: RavenDBConnection
  public error?: AppError | unknown
  public log: Log

  private eventListeners: Record<string, ContextEvent[]> = {}

  public constructor(ravendb: RavenDBConnection, logLevel: LogLevel = 'info') {
    this.store = ravendb()
    this.session = new Session(this.store)
    this.ravendb = ravendb
    this.log = new Log(logLevel)
    this.event = new InboundEvent()
  }

  public setEventSource(event: InboundEvent) {
    this.event = event
    return this
  }

  public setUser(user: AuthInfo) {
    this.user = user
  }

  /**
   * Register a listener for the specified session event
   * @param event
   * @param listener
   */
  public on<T extends keyof ContextEvents>(event: T, listener: ContextEvents[T]) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }

    this.eventListeners[event].push(listener)
  }

  /**
   * Raise an event and invoke event listeners asyncronously
   * @param event
   * @param arg
   * @returns
   */
  public async emit<T extends keyof ContextEvents>(event: T): Promise<void> {
    const events = this.eventListeners[event] || []

    for (const evt of events) {
      try {
        await evt(this)
      } catch (error) {
        this.log.error(`Listener for "${event}" threw`, error)
      }
    }
  }
}
