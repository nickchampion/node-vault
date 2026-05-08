export abstract class BaseModel {
  #index: string // # hash identifier ensures these fields dont get persisted to the database
  #collection: string

  public id!: string
  public patch: string | null = null
  public createdAtUTC!: string
  public updatedAtUTC!: string

  constructor(indexName: string, collectionName: string) {
    this.#index = indexName
    this.#collection = collectionName
  }

  getId(id: string): string {
    return id.includes('/') ? id : `${this.#collection}/${id}`
  }

  getIndexName(): string {
    return this.#index
  }

  getCollectionName(): string {
    return this.#collection
  }

  static friendlyId(id: string): string | null {
    return id ? (id?.includes('/') ? id.split('/').slice(1).join('/') : id) : null
  }
}
