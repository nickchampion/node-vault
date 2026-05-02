import { OpenAPIV3 } from 'openapi-types'

export const LoginResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['emailOrPhoneNumber'],
  nullable: false,
  properties: {
    emailOrPhoneNumber: { type: 'string' },
  }
}

export const LoginResponse: OpenAPIV3.ResponseObject = {
  description: 'Ok',
  content: {
    'application/json': {
      schema: LoginResponseSchema
    }
  }
}
