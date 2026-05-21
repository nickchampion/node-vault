import type { OpenAPIV3 } from 'openapi-types'
import { StandardResponse, ValidationError } from './common'

export const composeOpenApiDocument = (): OpenAPIV3.Document => {
  const document: OpenAPIV3.Document = {
    openapi: '3.0.1',
    info: {
      title: 'Node Vault Domain Schema',
      version: '1.0.0',
    },
    security: [],
    tags: [],
    components: {
      schemas: {
        ValidationErrorSchema: ValidationError,
        StandardResponseSchema: StandardResponse,
      },
    },
    paths: {},
  }

  return document
}
