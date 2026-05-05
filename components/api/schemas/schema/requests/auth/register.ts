import type { OpenAPIV3 } from 'openapi-types'

export const RegisterSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['firstName', 'lastName', 'email', 'phoneNumber'],
  nullable: false,
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
  },
}

export const RegisterRequest: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: RegisterSchema,
    },
  },
}
