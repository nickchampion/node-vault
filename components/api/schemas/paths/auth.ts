import type { OpenAPIV3 } from 'openapi-types'
import * as schema from '../schema/index.js'

export const auth: OpenAPIV3.PathsObject = {
  '/auth/login': {
    post: {
      operationId: 'authLogin',
      summary: 'Authenticate a user',
      description: 'Sends a login token to users email',
      tags: ['Auth'],
      security: [
        {
          jwt: [],
        },
      ],
      requestBody: schema.requests.auth.LoginRequest,
      responses: schema.responses.All(),
    },
  },
  '/auth/register': {
    post: {
      operationId: 'authRegister',
      summary: 'Register a user',
      description: 'Register a new user on the platform',
      tags: ['Auth'],
      security: [
        {
          jwt: [],
        },
      ],
      requestBody: schema.requests.auth.RegisterRequest,
      responses: schema.responses.All(schema.responses.auth.VerifyLoginResponse),
    },
  },
  '/auth/verify': {
    post: {
      operationId: 'authVerify',
      summary: 'Verify a user',
      description: 'Verify a users auth token',
      tags: ['Auth'],
      security: [
        {
          jwt: [],
        },
      ],
      requestBody: schema.requests.auth.VerifyLoginRequest,
      responses: schema.responses.All(schema.responses.auth.VerifyLoginResponse),
    },
  },
}
