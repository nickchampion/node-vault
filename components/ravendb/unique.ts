import {
  type IDocumentStore,
  PutCompareExchangeValueOperation,
  DeleteCompareExchangeValueOperation,
  GetCompareExchangeValueOperation
} from 'ravendb'

/**
 * Unique constraints are a challenge in a distrbuted multi-master cluster database. RavenDB supports the
 * concept of interlocked operations which allows us to reserve a key ensuring it is unique
 * across the entire cluster. This allows us to implement unique contraints by reserving a unique key first
 * (email for example) and if the reservation is successful we can create the document. You would
 * in general set the id of the document the key belongs to as the value
 *
 * RavenDB docs on compare exchange below...
 * https://ravendb.net/docs/article-page/5.3/csharp/client-api/operations/compare-exchange/overview
 */
export class UniqueConstraint<T> {
  store: IDocumentStore
  prefix: string
  key: string

  constructor(store: IDocumentStore, prefix: string, key: string) {
    this.store = store
    this.prefix = prefix
    this.key = key
  }

  release = async (): Promise<boolean> => {
    const formatted = this.format()
    const current = await this.store.operations.send(new GetCompareExchangeValueOperation<T>(formatted))

    if (current) {
      const result = await this.store.operations.send(new DeleteCompareExchangeValueOperation<T>(formatted, current.index))

      return result && result.successful
    }

    return false
  }

  format = () => {
    return `${this.prefix}/${this.key}`
  }

  acquire = async (value: T): Promise<boolean> => {
    const formatted = this.format()
    const result = await this.store.operations.send(new PutCompareExchangeValueOperation<T>(formatted, value, 0))
    return result && result.successful
  }

  get = async (): Promise<T> => {
    const formatted = this.format()
    const result = await this.store.operations.send(new GetCompareExchangeValueOperation<T>(formatted))
    return result?.value
  }
}
