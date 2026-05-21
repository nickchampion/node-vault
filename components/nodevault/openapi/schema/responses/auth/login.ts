import type { OpenAPIV3 } from 'openapi-types'
import { openapi } from '@nodevault/platform.components.domain'

export const LoginResponse: OpenAPIV3.ResponseObject = {
  description: 'Ok',
  content: {
    'application/json': {
      schema: openapi.common.StandardResponse,
    },
  },
}
