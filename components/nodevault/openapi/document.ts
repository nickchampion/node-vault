import type { OpenAPIV3 } from 'openapi-types'
import { openapi } from '@nodevault/platform.components.domain'
import * as paths from './paths/index.js'
import * as schema from './schema/index.js'

export const composeOpenApiDocument = (): OpenAPIV3.Document => {
  const document: OpenAPIV3.Document = {
    openapi: '3.0.1',
    info: {
      title: 'Node Vault API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api.nodevault.cloud',
        description: 'production',
      },
    ],
    security: [],
    tags: [
      { name: 'Account', description: 'Account and user management' },
      { name: 'Comms', description: 'Contact and communication' },
      { name: 'Auth', description: 'Authorisation & Registration' },
    ],
    components: {
      responses: openapi.responses.apiResponses,
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // account
        UserSchema: schema.responses.account.UserSchema,
        AccountSchema: schema.responses.account.AccountSchema,
        UserSearchResultsSchema: openapi.search.SearchResults(schema.responses.account.UserSchema),
        // auth
        VerifyLoginSchema: schema.responses.auth.VerifyLoginSchema,
        RegisterRequestSchema: schema.requests.auth.RegisterRequestSchema,
        // comms
        ContactRequestSchema: schema.requests.comms.ContactRequestSchema,
      },
    },
    paths: {
      ...paths.auth,
      ...paths.comms,
    },
  }

  return document
}
