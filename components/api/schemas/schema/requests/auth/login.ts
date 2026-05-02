import { OpenAPIV3 } from 'openapi-types'

export const LoginSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['emailOrPhoneNumber'],
  nullable: false,
  properties: {
    emailOrPhoneNumber: { type: 'string' },
  }
}

export const LoginRequest: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject = {
  content: {
    'application/json': {
      schema: {
        type: 'array',
        items: LoginSchema
      }
    }
  }
}
