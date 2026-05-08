import type { OpenAPIV3 } from 'openapi-types'
import { Phone } from '../../common'

export const UserSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['id', 'email', 'firstName', 'lastName', 'accountId', 'countryISO', 'phone', 'roles'],
  properties: {
    id: { type: 'string', nullable: false },
    email: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: false },
    firstName: { type: 'string', nullable: false },
    accountId: { type: 'string', nullable: false },
    countryISO: { type: 'string', nullable: false },
    phone: Phone,
    roles: { type: 'array', items: { type: 'string', enum: ['guest', 'user', 'admin'] }, nullable: false },
  },
}
