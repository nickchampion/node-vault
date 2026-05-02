import { useConfig } from '@nodevault/platform.libs.configuration'
import * as Sentry from '@sentry/nuxt'
import * as SentryCapacitor from '@sentry/capacitor'
import { SentryLogger, SentryInjectionKey, ConsoleLogger } from '@nodevault/platform.libs.services'

const config = useConfig()
const nuxtApp = useNuxtApp()

const sentryConfig = {
  dsn: config.sentry.dsn,
  enabled: config.sentry.enabled,
  environment: config.environment,
  sendDefaultPii: true,
  tracesSampleRate: 0.1,
  release: config.version,
  dist: config.dist,
  enableLogs: true,
}

if (config.sentry.enabled && config.version !== '1.0.0') {
  Sentry.init({
    ...sentryConfig,
    integrations: [Sentry.browserTracingIntegration(), Sentry.consoleLoggingIntegration({ levels: ['debug', 'warn', 'error'] })],
  })

  if (config.dist !== 'web') {
    SentryCapacitor.init(sentryConfig)
  }

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue error:', error, info)

    Sentry.captureException(error, {
      level: 'error',
      tags: {
        component: instance?.$options.name || 'Unknown',
        info: info,
      },
      extra: {
        vueError: true,
      },
    })
  }

  nuxtApp.vueApp.provide(SentryInjectionKey, new SentryLogger(Sentry, config.environment))
} else {
  nuxtApp.vueApp.provide(SentryInjectionKey, new ConsoleLogger(config.environment))
}
