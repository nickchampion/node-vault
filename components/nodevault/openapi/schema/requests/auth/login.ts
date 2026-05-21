import type { OpenAPIV3 } from 'openapi-types'

export const LoginRequestSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  nullable: false,
  properties: {
    email: { type: 'string', nullable: false },
  },
}

export const LoginRequest: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: LoginRequestSchema,
    },
  },
}
