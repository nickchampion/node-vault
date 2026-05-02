import { BaseModel, Errors, HectareError, Page, QuerySettings } from '@nodevault/platform.components.common'
import { getValueByPath } from '@nodevault/platform.components.utils'
import { DateTime } from 'luxon'
import type { IDocumentQuery, IDocumentSession, IDocumentStore } from 'ravendb'
import { utils } from './utils.js'

type SessionEvent = (session: Session) => Promise<void> | void

/**
 * Interface defining events the Session raises
 */
export interface SessionEvents {
  beforeCommit: SessionEvent
  afterCommit: SessionEvent
  commitError: SessionEvent
}

/**
 * Wrapper around database access scoped per event
 */
export class Session {
  private eventListeners: Record<string, SessionEvent[]> = {}
  private errorListeners: ((error: Error) => Promise<HectareError> | HectareError)[] = []

  // used by get requests to indicate we want to save the session, usually we dont commit the session on a get
  public commitOnGet: boolean
  public database: IDocumentSession
  public veto: boolean
  public commited: boolean
  public documentStore: IDocumentStore

  constructor(store: IDocumentStore) {
    this.documentStore = store
    this.database = store ? store.openSession() : null
    this.veto = false
    this.commitOnGet = false
    this.commited = false
  }

  dispose() {
    if (this.database) {
      this.database.dispose()
      this.database = null
    }

    this.eventListeners = {}
    this.errorListeners = []
    this.veto = false
    this.commitOnGet = false
    this.commited = false
  }

  clearEventListeners() {
    this.eventListeners = {}
    this.errorListeners = []
  }

  assertInit() {
    if (!this.database) throw new HectareError(Errors.Platform.SessionNotInitialised)
  }

  reset() {
    this.dispose()
    this.database = this.documentStore.openSession()
  }

  /**
   * Register a listener for the specified session event
   * @param event
   * @param listener
   */
  on<T extends keyof SessionEvents>(event: T, listener: SessionEvents[T]) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(listener)
  }

  /**
   * Register a listener for the event error event which is triggered when an event listener fails
   * @param listener
   */
  onEventError(listener: (error: Error) => Promise<HectareError> | HectareError) {
    this.errorListeners.push(listener)
  }

  /**
   * Raise an event and invoke event listeners asyncronously
   * @param event
   * @param arg
   * @returns
   */
  private async emit<T extends keyof SessionEvents>(event: T, arg: Session | IDocumentStore): Promise<void> {
    const events = this.eventListeners[event]

    if (!events) return

    const sessionFactory = () => (arg instanceof Session ? arg : new Session(arg))

    for (const evt of events) {
      try {
        await evt(sessionFactory())
      } catch (e) {
        for (const err of this.errorListeners) {
          err(e)
        }
      }
    }
  }

  /**
   * Try to commit the session and raise relevant session events
   * @returns
   */
  async commit(): Promise<void> {
    if (this.veto || !this.database) return

    try {
      // emit the beforeCommit event
      await this.emit('beforeCommit', this)

      // attempt to save the session to the database
      await this.database.saveChanges()

      // emit the afterCommit event
      await this.emit('afterCommit', this.documentStore)

      // only set if commit was successful
      this.commited = true
    } catch (e) {
      // emit the error event
      await this.emit('commitError', this.documentStore)
      throw e
    } finally {
      this.dispose()
    }
  }

  /**
   * Used to stream large number of documents from the database. Documents that are streamed are not tracked by the session
   * So any changes will not be part of the commit.
   * @param qry normal IDocumentQuery to find the documents you want to stream
   * @param map optional map to convert the documents from the source into another type
   * @returns
   */
  async stream<T extends BaseModel, TResult>(qry: IDocumentQuery<T>, map?: (doc: T) => TResult): Promise<TResult[]> {
    this.assertInit()

    const s = await this.database.advanced.stream(qry)
    const records: TResult[] = []

    return new Promise((resolve, reject) => {
      s.on('data', data => {
        try {
          records.push(map ? map(data) : data.document)
        } catch (e) {
          reject(e)
        }
      })

      s.on('error', err => {
        reject(err)
      })

      s.on('end', async () => {
        resolve(records)
      })
    })
  }

  /**
   * Store a document
   * @param source instance of the model to store in the DB
   */
  async store<T extends BaseModel>(source: T): Promise<void> {
    this.assertInit()

    source.createdAtUTC = DateTime.utc().toISO()
    source.updatedAtUTC = source.createdAtUTC
    await this.database.store<T>(source)
  }

  /**
   * Loads a document and updates only the fields contained in the patch
   * @param patch fields on the document to update
   * @param beforePatch optional function to run before we patch
   * @returns
   */
  async patch<T extends BaseModel>(patch: Partial<T>, beforePatch?: (doc: T) => Promise<void> | void): Promise<T> {
    this.assertInit()

    if (patch && patch.id) {
      const doc = await this.database.load<T>(patch.id)

      if (doc) {
        if (beforePatch) await beforePatch(doc)
        doc.updatedAtUTC = DateTime.utc().toISO()
        utils.patchDocument(doc, patch)
        return doc
      } else {
        throw new HectareError(Errors.Format(Errors.Platform.SessionDocumentNotFound, patch.id))
      }
    }

    throw new HectareError(Errors.Platform.SessionInvalidPatch)
  }

  /**
   * get a document from the database by ID. you can optionally pass in includes, this is a
   * object in this format { user: 'userId' } this will automatically populate a field called
   * user on the returned model using the userId field on the source document to find the user
   * @param id id of the document
   * @param includes includes load referenced documents into the current session by
   * the path to those IDs in the source document, reducing round trips
   * @param applyIncludes if this is true the includes will be applied to a property on the model before being returned
   * @returns
   */
  async get<T extends BaseModel>(id: string, includes?: Record<string, string>, applyIncludes?: boolean): Promise<T> {
    this.assertInit()

    let doc: T

    if (includes) {
      const keys = Object.keys(includes)

      if (keys.length > 0) {
        let r = this.database.include(includes[keys[0]])
        for (const key in keys.slice(1)) {
          r = r.include(includes[key])
        }
        doc = await r.load<T>(id)
      } else {
        doc = await this.database.load<T>(id)
      }
    } else {
      doc = await this.database.load<T>(id)
    }

    if (doc && includes && applyIncludes) {
      for (const key of Object.keys(includes)) {
        const id = getValueByPath(doc, includes[key])
        doc[key] = id ? await this.get(id) : null
      }
    }

    return doc
  }

  /**
   * Delete a document
   * @param doc
   * @returns
   */
  async delete<T extends BaseModel>(doc: T): Promise<void> {
    this.assertInit()
    if (!doc) return
    await this.database.delete<T>(doc)
  }

  /**
   * Get an IDocument query instance for the provided model or index
   * @param model
   * @returns
   */
  query<T extends BaseModel>(modelOrIndexName: (new () => T) | string): IDocumentQuery<T> {
    return this.database.query<T>({
      indexName: typeof modelOrIndexName == 'string' ? modelOrIndexName : new modelOrIndexName().getIndexName()
    })
  }

  /**
   * Generic function for searching an index.
   * @param model model type used to determine which index to search against
   * @param settings QuerySettings instance with any filters / paging info needed
   * generally parsed from the incoming URL by the EventSource.getQuerySettings function
   * @param includes any includes to pullback with each document in the results analygous to populate in MongoDB
   * @param augment a function to optionally augment the query before we run it
   * @returns
   */
  async search<T extends BaseModel>(
    modelOrIndexName: (new () => T) | string,
    settings: QuerySettings,
    includes?: Record<string, string>,
    augment?: (q: IDocumentQuery<T>) => IDocumentQuery<T>
  ): Promise<Page<T>> {
    this.assertInit()

    let query = this.database.query<T>({
      indexName: typeof modelOrIndexName == 'string' ? modelOrIndexName : new modelOrIndexName().getIndexName()
    })

    query = utils.applyFilters(query, settings)

    if (includes) {
      Object.keys(includes).forEach(key => {
        query = query.include(includes[key])
      })
    }

    if (augment) {
      query = augment(query)
    }

    if (settings.count) {
      return {
        docs: [],
        totalDocs: await query.count(),
        limit: settings.limit,
        offset: settings.offset
      }
    }

    if (settings.sortBy?.length) {
      for (const sort of settings.sortBy) {
        query = sort.sortDesc ? query.orderByDescending(sort.fieldName) : query.orderBy(sort.fieldName)
      }
    }

    const page = await utils.page(settings.limit, settings.offset, query)

    // map any includes to the specified fields
    if (includes) {
      for (const result of page.docs) {
        for (const key of Object.keys(includes)) {
          result[key] = await this.get<T>(result[includes[key]]) // preloaded so no round trip to db here
        }
      }
    }

    return page
  }
}
