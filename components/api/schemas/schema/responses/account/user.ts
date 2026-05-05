import type { OpenAPIV3 } from 'openapi-types'
import { Phone } from '../../common'

export const UserSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['id', 'email', 'firstName', 'lastName', 'accountId', 'countryISO', 'phone'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    lastName: { type: 'string' },
    firstName: { type: 'string' },
    accountId: { type: 'string' },
    countryISO: { type: 'string' },
    phone: Phone,
  },
}
