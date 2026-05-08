import { DocumentStore, type IAuthOptions, type ObjectTypeDescriptor, DocumentConventions } from 'ravendb'
import { serverConfiguration } from '@nodevault/platform.components.configuration.server'
import { MigrationRegistry } from './migrations.js'

let storeInstance: DocumentStore

/**
 * Document store is used to configure the database and to create sessions, sessions are very lightweight, DocumentStore less so
 * therefore a DocumentStore should be defined in the global scope so we have one instance per process
 * @param models all domain models used by this process
 * @returns
 */
export const createDocumentStore = (models?: Record<string, ObjectTypeDescriptor>): DocumentStore => {
  // By registering our models with the document store RavenDB will know to track these entities when used within a session
  const registerModels = (s: DocumentStore) => {
    if (models) {
      Object.values(models).forEach((model) => {
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
  const database = serverConfiguration.ravendb.database

  if (storeInstance) {
    // make sure all the models are registered (the store may be initialised by
    // multiple processes using different models each time)
    registerModels(storeInstance)
    // return the cached store
    return storeInstance
  }

  const cert: IAuthOptions = {
    certificate: serverConfiguration.ravendb.certificate,
    type: 'pem',
  }

  storeInstance = serverConfiguration.ravendb.certificate
    ? new DocumentStore(serverConfiguration.ravendb.endpoints, database, cert)
    : new DocumentStore(serverConfiguration.ravendb.endpoints, database)

  registerModels(storeInstance)

  storeInstance.conventions.registerEntityType(MigrationRegistry)

  // Will throw ConcurrencyError is we attempt to update a document that was updated since we loaded it
  // RavenDB does not use locking, so there may be occasions when we need to handle concurrency exceptions
  storeInstance.conventions.useOptimisticConcurrency = true

  // if the entity has a collection field use this for the collection name,
  // otherwise use the default which is pluralised name of the model
  storeInstance.conventions.findCollectionName = (type: any): string => {
    if (type.collection) return type.collection // collection needs to be a static field on the model class

    return DocumentConventions.defaultGetCollectionName(type)
  }

  // This allows us to identify the collection documents belong to by reading the private collection field
  // this is only relevant for object literals not classes derived from BaseModel
  storeInstance.conventions.findCollectionNameForObjectLiteral = (entity: any): string => {
    return entity.collection || 'Singletons' // default to Singletons
  }

  storeInstance.initialize()
  return storeInstance
}
