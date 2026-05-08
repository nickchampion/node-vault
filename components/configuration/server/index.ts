import { readFileSync } from 'node:fs'
import { base64Decode, decrypt } from '@nodevault/platform.components.utils.server'
import { build, type EnvironmentSettings } from '@nodevault/platform.components.configuration.core'
import { server as baseline } from './configuration.js'
import type { ServerConfiguration } from './configuration.js'

let environment: EnvironmentSettings

try {
  environment = JSON.parse(base64Decode(process.env.NODEVAULT!)) as EnvironmentSettings
} catch (error) {
  console.error('NODEVAULT Environment variable missing or invalid')
  throw error
}

const isTest = !!process.env.VITEST
const overridesPath = process.env.NODEVAULT_OVERRIDES

const loadOverrides = (path: string): Record<string, any> | undefined => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    console.error(error)
    console.error('Local overrides.json file not found cannot process configuration')
    return undefined
  }
}

const overrides = environment.environment === 'dev' && overridesPath ? loadOverrides(overridesPath) : undefined

export const serverConfiguration = build<ServerConfiguration>(baseline, environment, {
  overrides,
  applyTestOverrides: isTest,
  freeze: !isTest,
  extras: { environment },
  decrypt,
})
