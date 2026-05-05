import type { OpenAPIV3 } from 'openapi-types'

export const ValidationError: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    path: { type: 'string' },
    message: { type: 'string' },
    code: { type: 'string' },
    data: { type: 'object', nullable: true },
  },
}

export const StandardResponse: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['status', 'message'],
  properties: {
    status: { type: 'string' },
    message: { type: 'string' },
    stack: { type: 'string' },
    code: { type: 'string' },
    body: { type: 'object', additionalProperties: true },
    validation: { type: 'array', items: ValidationError },
  },
}

export const Page: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['limit', 'offset', 'docs', 'totalDocs'],
  properties: {
    totalDocs: { type: 'number' },
    limit: { type: 'number' },
    offset: { type: 'number' },
    docs: { type: 'array', items: { type: 'object' } },
  },
}

export const Country: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    iso: { type: 'string' },
    currency: { type: 'string' },
    callingCode: { type: 'string' },
    locale: { type: 'string' },
    continent: { type: 'string' },
  },
}

export const Coordinates: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['lat', 'lon'],
  additionalProperties: false,
  nullable: true,
  properties: {
    lat: { type: 'number', format: 'coordinates' },
    lon: { type: 'number', format: 'coordinates' },
  },
}

export const Address: OpenAPIV3.SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['line1', 'countryISO', 'postcode'],
  properties: {
    name: {
      type: 'string',
      nullable: true,
    },
    line1: { type: 'string' },
    line2: {
      type: 'string',
      nullable: true,
    },
    line3: {
      type: 'string',
      nullable: true,
    },
    city: {
      type: 'string',
      nullable: true,
    },
    region: {
      type: 'string',
      nullable: true,
    },
    regionISO: {
      type: 'string',
      nullable: true,
    },
    postcode: { type: 'string' },
    countryName: {
      type: 'string',
      nullable: true,
    },
    countryISO: {
      type: 'string',
      nullable: false,
    },
    coordinates: Coordinates,
  },
}

export const Phone: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['countryCode', 'number'],
  additionalProperties: false,
  properties: {
    countryCode: { type: 'string' },
    number: { type: 'string' },
  },
}

export const Date = (desc?: string): OpenAPIV3.SchemaObject => ({
  type: 'string',
  format: 'date-time',
  additionalProperties: false,
  description: desc || 'Date',
})

export const PhoneNumber: OpenAPIV3.SchemaObject = {
  type: 'string',
  description: 'Phone number',
  format: 'phone-number',
  nullable: true,
}

export const AlphaNumeric: OpenAPIV3.SchemaObject = {
  type: 'string',
  description: 'Alpha Numeric with Spaces',
  format: 'alpha-numeric',
}

export const AlphaNumeric30: OpenAPIV3.SchemaObject = {
  type: 'string',
  description: 'Up to 30 alpha numeric characters with spaces',
  format: 'alpha-numeric-30',
}

export const AlphaNumeric50: OpenAPIV3.SchemaObject = {
  type: 'string',
  description: 'Up to 50 alpha numeric characters with spaces',
  format: 'alpha-numeric-50',
}
