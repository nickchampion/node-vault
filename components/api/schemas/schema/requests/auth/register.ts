import type { OpenAPIV3 } from 'openapi-types'
import { Phone } from '../../common'

export const RegisterRequestSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['firstName', 'lastName', 'email'],
  nullable: false,
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phone: Phone,
  },
}

export const RegisterRequest: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: RegisterRequestSchema,
    },
  },
}
