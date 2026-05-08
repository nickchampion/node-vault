import type { OpenAPIV3 } from 'openapi-types'
import { StandardResponse } from '../../common'

export const LoginResponse: OpenAPIV3.ResponseObject = {
  description: 'Ok',
  content: {
    'application/json': {
      schema: StandardResponse,
    },
  },
}
