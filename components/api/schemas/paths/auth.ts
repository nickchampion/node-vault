import { OpenAPIV3 } from 'openapi-types'
import * as schema from '../schema/index.js'

export const auth: OpenAPIV3.PathsObject = {
  '/auth/login': {
    post: {
      operationId: 'authlogin',
      summary: 'Authenticate a user',
      description: 'Authenticate a user via email or phone',
      tags: ['Auth'],
      security: [
        {
          jwt: []
        }
      ],
      requestBody: schema.requests.LoginRequest,
      responses: schema.responses.All(schema.responses.auth.LoginResponse)
    }
  }
}
