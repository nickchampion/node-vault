import type { OpenAPIV3 } from 'openapi-types'
import { AccountSchema, UserSchema } from '../account/index.js'

export const VerifyLoginSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['tokens', 'user', 'account'],
  nullable: false,
  properties: {
    tokens: {
      type: 'object',
      additionalProperties: false,
      required: ['access', 'expiresIn'],
      nullable: false,
      properties: {
        access: { type: 'string', nullable: false },
        expiresAtUTC: { type: 'string', nullable: false },
      },
    },
    user: UserSchema,
    account: AccountSchema,
  },
}

export const VerifyLoginResponse: OpenAPIV3.ResponseObject = {
  description: 'Ok',
  content: {
    'application/json': {
      schema: VerifyLoginSchema,
    },
  },
}
