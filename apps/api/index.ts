import { Api } from '@nodevault/platform.components.api.server'
import { apiHandlers } from './handlers'
import { composeOpenApiDocument } from '@nodevault/platform.components.api.schemas'
import { indexes, models } from '@nodevault/platform.components.domain'

/**
 * services/local is our local web server so we can run all APIs at the same time locally
 * To include a new module into the server simply import the modules manifest and include it in the
 * constructor parameter to Api class.
 *
 * You should also add the modules events to the setEventPublisherFactory method to ensure the API
 * runs event handlers when the events are published
 */
const start = async () => {
  const api = new Api(
    {
      host: 'local.nodevault.cloud',
      port: 8001,
      local: true
    },
    {
      database: "NodeVault",
      name: 'nodevault',
      api: apiHandlers,
      models: models,
      indexes: indexes,
      document: composeOpenApiDocument
    }
  )

  await api.start(false)
}

start()
