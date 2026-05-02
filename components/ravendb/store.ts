import { DocumentStore, type IAuthOptions, type ObjectTypeDescriptor, DocumentConventions } from 'ravendb'
import { configuration } from '@nodevault/platform.components.configuration'
import { SystemSettings } from '@nodevault/platform.components.common'
import { MigrationRegistry } from './migrations.js'

/**
 * Singleton instance of a document store for each database so we dont create more than one for each running app instance
 */
const stores: Record<string, DocumentStore> = {}

/**
 * Document store is used to configure the database and to create sessions, sessions are very lightweight, DocumentStore less so
 * therefore a DocumentStore should be defined in the global scope so we have one instance per process
 * @param models all domain models used by this process
 * @returns
 */
export const createDocumentStore = (name: string, models?: Record<string, ObjectTypeDescriptor>): DocumentStore => {
  // By registering our models with the document store RavenDB will know to track these entities when used within a session
  const registerModels = (s: DocumentStore) => {
    if (models) {
      Object.values(models).forEach(model => {
        s.conventions.registerEntityType(model)
      })
    }
  }

  /**
    Need to handle a couple of scenarios here.

    1. If a name is supplied that exists in configuration.ravendb.databases (i.e. Customers, System etc)
      and we're in dev or local environment and there is a developer settings applied to config then use
      Platform_Developer database as we combine all services to use 1 DB
      for local & the dev environment.
    2. If the name does not exist in configuration.ravendb.databases then we're initialising
      an integration test database so directly
      use the name passed in, otherwise we just use the name from configuration which will be
      the correct database for the environment we're in
   */
  const database =
    configuration.ravendb.databases[name] && configuration.developer
      ? configuration.developer.startsWith('IntegrationTests_') || configuration.developer.startsWith('e2e')
        ? configuration.developer
        : `Platform_${configuration.developer || 'Dev'}`
      : (configuration.ravendb.databases[name] ?? name)

  if (stores[database]) {
    // make sure all the models are registered (the store may be initialised by
    // multiple processes using different models each time)
    registerModels(stores[database])
    // return the cached store
    return stores[database]
  }

  const cert: IAuthOptions = {
    certificate: configuration.ravendb.certificate,
    type: 'pem'
  }

  const authOptions: IAuthOptions = configuration.ravendb.certificate ? cert : null
  const store = new DocumentStore(configuration.ravendb.endpoints, database, authOptions)

  registerModels(store)

  store.conventions.registerEntityType(MigrationRegistry)
  store.conventions.registerEntityType(SystemSettings)

  // Will throw ConcurrencyError is we attempt to update a document that was updated since we loaded it
  // RavenDB does not use locking, so there may be occasions when we need to handle concurrency exceptions
  store.conventions.useOptimisticConcurrency = true

  // if the entity has a collection field use this for the collection name,
  // otherwise use the default which is pluralised name of the model
  store.conventions.findCollectionName = (type: any): string => {
    if (type.collection) return type.collection // collection needs to be a static field on the model class
    return DocumentConventions.defaultGetCollectionName(type)
  }

  // This allows us to identify the collection documents belong to by reading the private collection field
  // this is only relevant for object literals not classes derived from BaseModel
  store.conventions.findCollectionNameForObjectLiteral = (entity: any): string => {
    return entity.collection || 'Singletons' // default to Singletons
  }

  store.initialize()
  stores[database] = store
  return store
}
