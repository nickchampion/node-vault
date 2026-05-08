import { Api, indexes } from '@nodevault/platform.components.api.server'
import { composeOpenApiDocument } from '@nodevault/platform.components.api.schemas'
import { models } from '@nodevault/platform.components.domain'
import { serverConfiguration } from '@nodevault/platform.components.configuration.server'
import { apiHandlers } from './handlers/index.js'

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
      host: serverConfiguration.dev ? 'api.nodevault.local' : undefined,
      port: 9002,
    },
    {
      name: 'nodevault',
      api: apiHandlers,
      models: models,
      indexes: indexes,
      document: composeOpenApiDocument,
    },
  )

  await api.start()
}

start()
