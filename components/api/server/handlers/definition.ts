import type { IApiManifest } from '@nodevault/platform.components.context'
import { type AjvCustomizer, OpenAPIBackend } from 'openapi-backend'
import { registerGlobalHandlers, registerSecurityHandler, wrapHandlersWithContextSignature } from './index.js'

export type ApiDefinition = {
  manifest: IApiManifest
  server: OpenAPIBackend
}

/**
 * Centralised place to put any custom formats for schema validations
 * @param originalAjv
 * @returns
 */
const addCustomFormats: AjvCustomizer = originalAjv => {
  originalAjv.addFormat('date-time', /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/)
  //TODO: remove optional space once FE has updated otherwise we cant parse phone number properly
  originalAjv.addFormat('phone-number', /^\+[0-9]{1,3}[ ]*[0-9]{6,15}$/)
  originalAjv.addFormat('coordinates', /^(\+|-)*([0-9]{1,3})\.([0-9]{5,12})$/)
  originalAjv.addFormat('alpha-numeric', /^[A-Za-z0-9- ]+$/)
  originalAjv.addFormat('alpha-numeric-30', /^[A-Za-z0-9- ]{2,30}$/)
  originalAjv.addFormat('alpha-numeric-50', /^[A-Za-z0-9- ]{2,50}$/)
  originalAjv.addFormat('email', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  originalAjv.addFormat('uri', /^https?:\/\/[^\s/$.?#].[^\s]*$/)

  return originalAjv
}

export const buildApiDefinitions = (manifest: IApiManifest): ApiDefinition => {
  const api = new OpenAPIBackend({
      definition: manifest.document(),
      handlers: wrapHandlersWithContextSignature(manifest.api),
      strict: true,
      customizeAjv: addCustomFormats,
      ajvOpts: {
        validateFormats: true,
        allErrors: true,
        strict: false
      },
      quick: true
    })

    registerSecurityHandler(api)
    registerGlobalHandlers(api)

  return  {
    manifest: manifest,
    server: api
  }
}
