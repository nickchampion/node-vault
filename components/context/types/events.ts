import { configuration } from '@nodevault/platform.components.configuration'
import { sleep, clone } from '@nodevault/platform.components.utils'
import type { IndexBatchOptions } from 'ravendb'
import { Context } from '../context.js'
import { middy } from '../middy.js'
import type { EventHandler } from './manifest.js'

/**
 * Manages building a list of EventHandlers ensuring they are named uniquely
 */
export class EventHandlersBuilder {
  handlers: Record<string, EventHandler>

  constructor() {
    this.handlers = {}
  }

  static create = () => {
    return new EventHandlersBuilder()
  }

  addHandlers = (handlers: Record<string, EventHandler>) => {
    Object.keys(handlers).forEach(k => {
      this.addHandler(k, handlers[k])
    })
    return this
  }

  addHandler = (name: string, handler: EventHandler) => {
    if (this.handlers[name])
      throw new Error(`Cannot register event handlers, you have duplicate keys: ${name}`)

    this.handlers[name] = handler
    return this
  }

  done = (): Record<string, EventHandler> => {
    return this.handlers
  }
}

/**
 * Generic handler for lambdas invoked from by the event bridge. Handlers are responsible for initialising the context
 * which provides access to the event and database session
 * @param event
 * @param handlers
 * @param module
 * @param store
 */
export class EventsHandler {
  handlerMap: Record<string, string[]> | undefined
  handlers: Record<string, EventHandler>
  module: string
  indexOptions: IndexBatchOptions | null = null

  constructor(handlers: Record<string, EventHandler>, module: string, handlerMap?: Record<string, string[]>) {
    this.handlers = handlers
    this.module = module
    this.handlerMap = handlerMap
  }

  handlerExistsForEvent(name: string): boolean {
    return this.handlers[name] ? true : false
  }

  setIndexOptions(indexOptions: IndexBatchOptions) {
    this.indexOptions = indexOptions
  }

  addHandler(name: string, handler: EventHandler) {
    this.handlers[name] = handler
  }

  async handle<T extends BaseEventPayload>(event: any, evtContext: any, lambdaHandler: LambdaHandler): Promise<void> {
    // allow us to modify the event globally should we need to
    lambdaHandler.apply(event)

    let context: Context | null = null

    const createContext = (): Context => {
      const payload = clone(event.detail as T)
      const context = new Context(lambdaHandler.ravendb, lambdaHandler.postgres).setEventSource(
        new EventSource({
          path: event['detail-type'],
          payload: payload,
          type: 'event',
          method: 'event',
          module: this.module,
          headers: {
            'x-log-group': evtContext.logGroupName,
            'x-log-stream': evtContext.logStreamName,
            'x-function-name': evtContext.functionName,
            'x-request-id': evtContext.awsRequestId,
            'x-function-arn': evtContext.invokedFunctionArn,
            'x-source-detail-type': event['source-detail-type'] ?? event['detail-type'],
            'x-audit': 'true',
            'x-e2e-database-name': lambdaHandler.e2eDatabase
          },
          correlationId: payload.correlationId || null,
          version: configuration.version,
          operation: event['detail-type'],
          app: payload.app
        })
      )

      // all events are authenticated with the system admin user, this is handled globally outside the lambda functions
      context.event.setAuthTokens(lambdaHandler.user.tokens)
      context.user = lambdaHandler.user.user

      if ((configuration.local || configuration.testContext) && this.handlerMap) {
        context.events = new TestEventPublisher(
          context,
          new EventsHandler(this.handlers, 'local'),
          this.handlerMap,
          lambdaHandler.user
        )
      }

      return context
    }

    const tryExecuteHandler = async () => {
      // create our own context for this invocation
      context = createContext()

      try {
        // Give lambdaHandler access to context for error logging
        lambdaHandler.context = context

        if (this.indexOptions) {
          context.session.database.advanced.waitForIndexesAfterSaveChanges(this.indexOptions)
        }

        // allows override of IApiClientFactory and IEventPublisher for test scenarios
        if (this.contextOverrides && (configuration.testContext || configuration.local)) {
          this.contextOverrides(context)
        }

        const baseHandler = this.handlers[context.event.path]

        if (!baseHandler) {
          throw new HectareError(Errors.Format(Errors.Platform.HandlerNotFound, context.event.path), context.event)
        }

        context.log.entry
          .withLevel('info')
          .withDataField('eventContext', evtContext)
          .withAuthInfo(context.user)
          .withMessage(`Successfully executed handler::${context.event.path}`)

        // execute the handler & middleware
        await middy(context, baseHandler)
      } catch (e) {
        e.context = context
        throw e
      }
    }

    const shouldRetry = (e: any) => {
      return (
        (e.name && e.name === 'ConcurrencyException') ||
        (e.stack && e.stack.toLowerCase().indexOf('an exception occurred while contacting') > -1)
      )
    }

    for (let i = 1; i <= 3; i += 1) {
      try {
        await tryExecuteHandler()
        return
      } catch (e) {
        if (shouldRetry(e)) {
          if (i === 3) throw e
          await sleep(100) //wait for 100ms and try again
        } else {
          throw e
        }
      }
    }
  }
}
