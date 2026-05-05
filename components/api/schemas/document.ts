import type { OpenAPIV3 } from 'openapi-types'
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
    ],
    components: {
      responses: schema.responses.ApiResponses,
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ValidationErrorSchema: schema.common.ValidationError,
        StandardResponseSchema: schema.common.StandardResponse,
        AddressSchema: schema.common.Address,
        UserSchema: schema.responses.account.UserSchema,
        AccountSchema: schema.responses.account.AccountSchema,
        UserSearchResultsSchema: schema.common.SearchResults(schema.responses.account.UserSchema),
        LoginRequestSchema: schema.requests.auth.LoginSchema,
        LoginResponseSchema: schema.responses.auth.LoginResponseSchema,
      },
    },
    paths: {
      ...paths.auth,
    },
  }

  return document
}
