export type Environment = 'local' | 'prod'

export interface ClientConfiguration {
  version: string
  environment: Environment
  dist: string
  app: string
  local: boolean
  platform: {
    api: string
    apiProxy: string
    assets: string
  }
}

export interface EnvironmentSettings {
  key: string
  salt: string
  environment: Environment
}

export type ServerConfiguration = {
  apiHost: string
  appHost: string
  developer: string
  environment: Environment
  version: string
  local: boolean
  production: boolean
  ravendb: RavenDB
  cloudflare: Cloudflare
}

export type RavenDB {
  backupCredentials: string
  testDatabaseName: string
  nodes: string[]
  endpoints: string[]
  certificate: string
  databases: Record<string, string>
}

export type Cloudflare {
  accountId: string
  apiToken: string
  browserToken: string
  subdomain: string
}
