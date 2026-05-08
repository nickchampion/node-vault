import type { OpenAPIV3 } from 'openapi-types'
import { VerifyLoginSchema } from './verify.js'

export const RegisterResponse: OpenAPIV3.ResponseObject = {
  description: 'Ok',
  content: {
    'application/json': {
      schema: VerifyLoginSchema,
    },
  },
}
