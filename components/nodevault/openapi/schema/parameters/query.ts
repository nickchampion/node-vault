import type { OpenAPIV3 } from 'openapi-types'

export const id: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'query',
  required: false,
  description: 'ID',
  schema: {
    type: 'string',
  },
  allowEmptyValue: true,
}
