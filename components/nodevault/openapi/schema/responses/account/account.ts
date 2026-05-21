import type { OpenAPIV3 } from 'openapi-types'

export const AccountSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
}
