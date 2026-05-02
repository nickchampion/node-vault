import type { IApiManifest } from '@nodevault/platform.components.context'
import { indexes, models } from '@nodevault/platform.components.domain'
import { composeOpenApiDocument } from '@nodevault/platform.components.api.schemas'
import { apiHandlers } from './handlers/index.js'

/**
 * A modules manifest defines the API routes, event handlers, models and indexes exported by this module
 * A manifest is used to configure a service, a service can be composed of one or more manifests
 * giving flexibility over the granularity of each service
 *
 * We use OpenAPIBackend to handle routing, validtion and documentation, this allows us to define the
 * module specification in one place, a yml file.
 */

export const manifest: IApiManifest = {
  database: "NodeVault",
  name: 'nodevault',
  api: apiHandlers,
  models,
  indexes,
  document: composeOpenApiDocument
}
