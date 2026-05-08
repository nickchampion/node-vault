import type { OpenAPIV3 } from 'openapi-types'

export const VerifyLoginRequestSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['code'],
  nullable: false,
  properties: {
    code: { type: 'string' },
  },
}

export const VerifyLoginRequest: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: VerifyLoginRequestSchema,
    },
  },
}
