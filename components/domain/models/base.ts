export abstract class BaseModel {
  #index: string // # hash identifier ensures these fields dont get persisted to the database
  #collection: string

  public id: string | undefined
  public patch: string | undefined
  public createdAtUTC: string | undefined
  public updatedAtUTC: string | undefined

  constructor(indexName: string, collectionName: string) {
    this.#index = indexName
    this.#collection = collectionName
  }

  getId(id: string): string {
    return !id.includes('/') ? `${this.#collection}/${id}` : id
  }

  getIndexName(): string {
    return this.#index
  }

  getCollectionName(): string {
    return this.#collection
  }

  static friendlyId(id: string): string | null {
    return id ? (!id?.includes('/') ? id : id.split('/').slice(1).join('/')) : null
  }
}
