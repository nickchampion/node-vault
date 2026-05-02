import { base64Decode, decrypt } from '@nodevault/platform.components.utils'
import type { ClientConfiguration, EnvironmentSettings, ServerConfiguration } from './types.js'
import { readFileSync } from 'node:fs'

let serverConfiguration: any = null
let clientConfiguration: any = null
let environment: EnvironmentSettings | null = null
let overrides: any = null

try {
  environment = JSON.parse(base64Decode(process.env.HECTARE!)) as EnvironmentSettings
} catch (e) {
  console.error('HECTARE Environment variable missing or invalid')
  throw e
}

const settings = {
  default: 'default',
  encrypted: 'encrypted',
  overrides: process.env.HECTARE_OVERRIDES,
  test: process.env.VITEST
}

const getOverrides = (path: string) => {
  try {
    if (!overrides) overrides = JSON.parse(readFileSync(path, 'utf-8'))
    return overrides
  } catch {
    console.error('Local overrides.json file not found cannot process configuration')
  }
}

const getEnvironmentValue = (value: any) => {
  const environments: Record<string, any> = {}

  Object.keys(value).forEach(prop => {
    prop.split('_').forEach(e => {
      environments[e] = value[prop]
    })
  })

  return environments
}

/**
 * Take a period separated path i.e. redis.connection.host from developers overrides.json file, spli0t it on period
 * and use the recursive function below to locate the property at the path, opnce located replace the value with the
 * value from the developers overrides.json file
 * @param configuration
 * @param pathParts
 * @param index
 * @param replacement
 * @returns
 */
const overrideProperty = (configuration: any, pathParts: string[], index: number, replacement: string) => {
  if (configuration[pathParts[index]] && typeof configuration[pathParts[index]] === 'object') {
    return overrideProperty(configuration[pathParts[index]], pathParts, index + 1, replacement)
  }

  configuration[pathParts[index]] = replacement
}

/**
 * We iterate through all properties on the configuration json file and apply the following logic
 * 1. If the value of the property is an array just set the value on to the resulting configuration instance
 * 2. If the value is an object and it has a key named default then we know its a property that contains a set
 * of environment specific child properties. In which case we locate the correct value using the environment we're
 * building the configuration for and if necessary decrypt the value. We also support AWS Secrets Manager secrets.
 * If we find a string whose value starts with arn:aws:secretsmanager the we know its a pointer to a secret. If this
 * is the case we set the value to a function (returned from getAwsSecretFunction at the top of this file) which will
 * use our secrets manager helper to get the secret when its first requewsted and cache it
 * 3. If its an object but has no default property then recursivelty call this function for its child properties
 * 4. Finally If the property value is a function or string just copy the value to the resulting configuration
 * @param parent
 * @param name
 * @param value
 */
const assignProperty = (environment: EnvironmentSettings, parent: any, name: string, value: any) => {
  if (!value || Array.isArray(value)) {
    parent[name] = value
  } else if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, settings.default)) {
    const encrypted = Object.prototype.hasOwnProperty.call(value, settings.encrypted) ? value[settings.encrypted] : false

    const envValues = getEnvironmentValue(value)

    const exists =
      Object.prototype.hasOwnProperty.call(envValues, environment.environment) ||
      Object.prototype.hasOwnProperty.call(envValues, settings.default)

    const extracted = exists
      ? Object.prototype.hasOwnProperty.call(envValues, environment.environment)
        ? envValues[environment.environment]
        : envValues[settings.default]
      : null

    if (!exists || extracted === null) {
      parent[name] = null
    } else if (extracted.toString().toLowerCase().startsWith('env$')) {
      parent[name] = process.env[extracted.toString().split('$')[1].toUpperCase()]
    } else {
      parent[name] = encrypted && extracted ? decrypt(extracted, environment.key, environment.salt) : extracted
    }
  } else if (typeof value === 'object') {
    // if its an object but has no key named default then we're interested in its children so recursively call assignProperty
    parent[name] = {}
    Object.keys(value).forEach(prop => {
      assignProperty(environment, parent[name], prop, value[prop])
    })
  } else if (value?.toString().toLowerCase().startsWith('env$')) {
    // if the value starts with env$ this indicates we'll read the value from process.env
    parent[name] = process.env[value?.toString().split('$')[1].toUpperCase()]
  } else {
    // if the property is not an object just take its value, means its the same value in all environments
    parent[name] = value
  }
}

export const buildClient = (environment: EnvironmentSettings, version: string, api: string, dist: string): ClientConfiguration => {
  // for local development look for an overrides file which will contain configuration variable overrides
  const local: any = {} // environment === 'local' && settings.overrides ? getOverrides(settings.overrides) : {}

  // config object we'll build
  const builder: Record<string, any> = {}

  // iterate through all properties on the source configuration instance and locate the correct environment value for it
  Object.keys(clientConfiguration).forEach((prop) => {
    assignProperty(environment, builder, prop, clientConfiguration[prop])
  })

  const override = (path: string) => {
    const value = local[path]

    if (path.startsWith('tests.')) {
      path = path.replace('tests.', '')
    }

    overrideProperty(builder, path.split('.'), 0, value)
  }

  // apply any local overrides to the config values we've built
  Object.keys(local)
    .filter(k => !k.startsWith('tests.'))
    .forEach((path) => {
      override(path)
    })

  const config = builder as ClientConfiguration

  if (api && api === 'local' && environment.environment === 'local') {
    config.platform.api = 'http://localhost:8001'
    config.platform.apiProxy = 'http://localhost:8001'
  }

  config.environment = environment.environment
  config.version = version
  config.dist = dist

  // done
  return Object.freeze(config)
}

export const buildServer = (baseline: any, environment: EnvironmentSettings): ServerConfiguration => {
  // for local development look for an overrides file which will contain configuration variable overrides
  const local = environment.environment === 'local' && settings.overrides ? getOverrides(settings.overrides) : {}

  // config object we'll build
  const builder : ServerConfiguration = <ServerConfiguration>{
    environment: environment.environment
  }

  // iterate through all properties on the source configuration instance and locate the correct environment value for it
  Object.keys(baseline).forEach(prop => {
    assignProperty(environment, builder, prop, baseline[prop])
  })

  const override = (path: string) => {
    let value = local[path]

    if (path.startsWith('encrypted.')) {
      value = decrypt(value, environment.key, environment.salt)
      path = path.replace('encrypted.', '')
    }

    if (path.startsWith('tests.')) {
      path = path.replace('tests.', '')
    }

    overrideProperty(builder, path.split('.'), 0, value)
  }

  // apply any local overrides to the config values we've built
  Object.keys(local)
    .filter(k => !k.startsWith('tests.'))
    .forEach(path => {
      override(path)
    })

  // apply any test only overrides if tests are running
  if (settings.test) {
    Object.keys(local)
      .filter(k => k.startsWith('tests.'))
      .forEach(path => {
        override(path)
      })
  }

  // make configuration immutable
  if (!settings.test) {
    Object.keys(builder).forEach(prop => {
      builder[prop] = Object.freeze(builder[prop])
    })
  }

  const config = builder as ServerConfiguration

  // done
  return settings.test ? config : Object.freeze(config)
}

export const cached = (): ServerConfiguration => {
  if (serverConfiguration !== null) return serverConfiguration
  serverConfiguration = buildServer(serverConfiguration, environment)
  return serverConfiguration
}

