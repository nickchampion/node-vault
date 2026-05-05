export { composeOpenApiDocument } from './document.js'
export * from './models/index.js'
export * from './schema/index.js'

export type ValidationError = {
  path: string
  message: string
  code?: string
  data?: unknown
}

export type StandardResponse = {
  status: string
  message: string
  stack?: string
  code?: string
  body?: unknown
  validation?: ValidationError[]
}
