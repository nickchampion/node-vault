import type { OpenAPIV3 } from 'openapi-types'
import { Phone } from '../../common'

export const ContactRequestSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email', 'interests', 'message'],
  nullable: false,
  properties: {
    name: { type: 'string', nullable: false },
    email: { type: 'string', format: 'email', nullable: false },
    interests: {
      type: 'array',
      items: { type: 'string', enum: ['grapheneos', 'umbrelos', 'business', 'other'] },
      minItems: 1,
    },
    message: { type: 'string', nullable: false },
    phone: Phone,
  },
}

export const ContactRequest: OpenAPIV3.RequestBodyObject = {
  required: true,
  content: {
    'application/json': {
      schema: ContactRequestSchema,
    },
  },
}
