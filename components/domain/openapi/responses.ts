import type { OpenAPIV3 } from 'openapi-types'
import { StandardResponse } from './common.js'

export const unauthorised: OpenAPIV3.ResponseObject = {
  description: 'Unauthorised',
  content: {
    'application/json': {},
  },
}

export const permenantRedirect = (): OpenAPIV3.ResponsesObject => {
  return {
    301: {
      description: 'Moved Permanently',
    },
  }
}

export const all = (ok?: OpenAPIV3.ResponseObject): OpenAPIV3.ResponsesObject => {
  return {
    200: ok || { $ref: '#/components/responses/Ok' },
    401: { $ref: '#/components/responses/Unauthorized' },
    403: { $ref: '#/components/responses/Forbidden' },
    400: { $ref: '#/components/responses/BadRequest' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/Error' },
  }
}

export const apiResponses: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject> = {
  Unauthorized: {
    description: 'Invalid or expired token, please login again.',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
  Forbidden: {
    description: 'You do not have access to the requested resource.',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
  NotFound: {
    description: 'The requested resource cannot be found.',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
  BadRequest: {
    description: 'The request contains malformed data in path, query parameters, or body.',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
  Error: {
    description: 'Something went wrong, please reload or go back and try again.',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
  Ok: {
    description: 'Ok',
    content: {
      'application/json': {
        schema: StandardResponse,
      },
    },
  },
}
