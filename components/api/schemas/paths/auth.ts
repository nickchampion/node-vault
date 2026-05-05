import type { OpenAPIV3 } from 'openapi-types'
import * as schema from '../schema/index.js'

export const auth: OpenAPIV3.PathsObject = {
  '/auth/login': {
    post: {
      operationId: 'authLogin',
      summary: 'Authenticate a user',
      description: 'Authenticate a user via email or phone',
      tags: ['Auth'],
      security: [
        {
          jwt: [],
        },
      ],
      requestBody: schema.requests.auth.LoginRequest,
      responses: schema.responses.All(schema.responses.auth.LoginResponse),
    },
  },
}
