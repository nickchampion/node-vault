import type { OpenAPIV3 } from 'openapi-types'
import { openapi } from '@nodevault/platform.components.domain'

export const system: OpenAPIV3.PathsObject = {
  '/system/ping': {
    get: {
      operationId: 'systemPing',
      summary: 'Health check',
      description: 'Returns ok — used by monitoring and uptime checks',
      tags: ['System'],
      security: [],
      responses: openapi.responses.all(),
    },
  },
}
