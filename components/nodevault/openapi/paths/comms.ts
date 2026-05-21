import type { OpenAPIV3 } from 'openapi-types'
import { openapi } from '@nodevault/platform.components.domain'
import * as schema from '../schema/index.js'

export const comms: OpenAPIV3.PathsObject = {
  '/comms/contact': {
    post: {
      operationId: 'commsContact',
      summary: 'Submit a contact enquiry',
      tags: ['Comms'],
      requestBody: schema.requests.comms.ContactRequest,
      responses: openapi.responses.all(),
    },
  },
}
