import { type Page, type QuerySettings, type BaseModel, collections, GeneralError } from '@nodevault/platform.components.domain'
import { randomAlphaNumeric } from '@nodevault/platform.components.utils'
import {
  type FacetBase,
  type IndexQuery,
  type QueryStatistics,
  FacetBuilder,
  PatchByQueryOperation,
  type IDocumentQuery,
  type IDocumentSession,
  type IDocumentStore,
} from 'ravendb'

class Utils {
  INT_MAX_VALUE = 2147483647

  async sleep(milliseconds: number): Promise<void> {
    new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  buildFacet<T>(builder: (facetBuilder: FacetBuilder<T>) => void): FacetBase {
    const ff = new FacetBuilder<T>()

    builder(ff)
    return ff.getFacet()
  }

  applyFilters<T extends BaseModel>(query: IDocumentQuery<T>, settings: QuerySettings): IDocumentQuery<T> {
    Object.keys(settings.filters ?? [])
      .filter(k => settings.filters![k])
      .forEach((key) => {
        const negate = settings.filters![key][0] === '-'
        const value = negate ? settings.filters![key].toString().slice(1) : settings.filters![key].toString()

        if (value.includes(',')) {
          query = negate
            ? query.not().whereIn(key, <string[]>collections.map(key, value.split(',')))
            : query.whereIn(key, <string[]>collections.map(key, value.split(',')))
        } else {
          query = negate
            ? query.whereNotEquals(key, collections.map(key, value))
            : query.whereEquals(key, collections.map(key, value))
        }
      })

    if (settings.startDateISO && settings.endDateISO) {
      return query.whereBetween('createdAtUTC', settings.startDateISO, settings.endDateISO)
    }

    if (settings.startDateISO && !settings.endDateISO) {
      return query.whereGreaterThanOrEqual('createdAtUTC', settings.startDateISO)
    }

    if (!settings.startDateISO && settings.endDateISO) {
      return query.whereLessThanOrEqual('createdAtUTC', settings.endDateISO)
    }

    return query
  }

  async page<T extends BaseModel>(limit: number, offset: number, query: IDocumentQuery<T>): Promise<Page<T>> {
    let stats: QueryStatistics | null = null

    const q = query.take(limit).skip(offset)
    const result = q.statistics(s => (stats = s)).lazily() // lazily incase we've issued other lazy queries in the session

    return {
      docs: await result.getValue(),
      totalDocs: (stats as QueryStatistics | null)?.totalResults ?? 0,
      limit: limit,
      offset: offset,
    }
  }

  patchDocument<T>(source: T, patch: Record<string, any>): T {
    const target = source as Record<string, any>

    Object.keys(patch).forEach((key) => {
      if (typeof patch[key] === 'object' && patch[key] != null && !Array.isArray(patch[key])) {
        if (target[key] && typeof target[key] !== 'object') {
          throw new GeneralError('Invalid patch script')
        }

        // make sure its initialised incase source is null or undefined
        if (!target[key]) target[key] = {}

        // sync all fields on the patch object
        this.patchDocument(target[key], patch[key])
      } else {
        target[key] = patch[key]
      }
    })
    return source
  }

  async patchServer(store: IDocumentStore, patchQuery: IndexQuery, waitForCompletion = true): Promise<void> {
    const p = new PatchByQueryOperation(patchQuery)
    const operation = await store.operations.send(p)

    if (waitForCompletion) await operation.waitForCompletion()
  }

  async patch<T extends BaseModel>(
    model: new () => T,
    store: IDocumentStore,
    patch: (session: IDocumentSession, doc: T) => Promise<void>,
    batchSize = 1024,
    maxRequestsPerSession?: number,
    filter?: (q: IDocumentQuery<T>) => IDocumentQuery<T>,
  ): Promise<void> {
    const index = new model().getIndexName()
    // used to allow us to go through all docs patching them as we process them and querying by the patch key
    const uniquePatchKey = randomAlphaNumeric(10)

    while (true) {
      const session = store.openSession()

      if (maxRequestsPerSession) session.advanced.maxNumberOfRequestsPerSession = maxRequestsPerSession

      // wait for indexing after each session save
      session.advanced.waitForIndexesAfterSaveChanges({
        indexes: [index],
        throwOnTimeout: false,
        timeout: 120000,
      })

      let query = session.query<T>({ indexName: index })

      if (filter) {
        query = filter(query)
      }

      // load the next batchSize of docs that have not been patched and patch them
      const docs = await query.whereNotEquals('patch', uniquePatchKey).take(batchSize).all()

      if (docs && docs.length > 0) {
        for (const doc of docs) {
          await patch(session, doc)
          doc.patch = uniquePatchKey
        }
        await session.saveChanges()
      } else {
        break
      }
    }
  }
}

export const utils = new Utils()
