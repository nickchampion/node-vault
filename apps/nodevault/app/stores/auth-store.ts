import type { ApiOptions, ApiResponse } from '@nodevault/platform.components.api.client'
import type { UserSchema, VerifyLoginSchema } from '@nodevault/platform.components.api.schemas'
import { isFutureDate, toUtcIso } from '@nodevault/platform.components.utils'

export const useAuthStore = defineStore('auth', () => {
  const device = useDevice()
  const config = useConfig()
  const user = ref<UserSchema | null>(null)

  const cookieOptions = {
    secure: config.environment !== 'dev',
    maxAge: 30 * 24 * 60 * 60,
  }

  const auth = useCookie<string | null>('nodevault-auth', cookieOptions)
  const refresh = useCookie<string | null>('nodevault-refresh', cookieOptions)
  const expires = useCookie<string | null>('nodevault-expires', cookieOptions)

  const isCloudflareWorker = () => {
    return typeof globalThis !== 'undefined'
      && typeof globalThis.fetch === 'function'
      && globalThis.document === undefined
      && globalThis.WorkerGlobalScope !== undefined
  }

  const cookies = [
    { ref: auth, key: 'nodevault-auth' },
    { ref: refresh, key: 'nodevault-refresh' },
    { ref: expires, key: 'nodevault-expires' },
  ]

  const authenticated = (): boolean => {
    return auth.value != null && expires.value != null && isFutureDate(expires.value)
  }

  const apiOptions = (): ApiOptions => {
    return {
      tokens: {
        access: auth.value,
        refresh: refresh.value,
      },
      device: determineDeviceInfo(device),
      baseUri: isCloudflareWorker() ? config.platform.api : config.platform.apiProxy,
      version: config.version,
    }
  }

  const logout = (clearUser: boolean = true) => {
    auth.value = null
    refresh.value = clearUser ? null : refresh.value
    expires.value = null
    user.value = null

    cookies.forEach(({ key }) => {
      useCookie(key, { maxAge: 0 }).value = null
    })
  }

  const setAuthTokens = (verifyResponse: ApiResponse<VerifyLoginSchema>) => {
    if (verifyResponse.success && verifyResponse.data) {
      auth.value = verifyResponse.data.tokens.access!
      expires.value = toUtcIso(verifyResponse.data.tokens.expiresAtUTC!)
      user.value = verifyResponse.data.user
    }
  }

  const userHasRole = (role: UserSchema['roles'][number]): boolean => {
    return user.value?.roles.includes(role) ?? false
  }

  return {
    auth,
    refresh,
    expires,
    user,
    logout,
    setAuthTokens,
    authenticated,
    userHasRole,
    apiOptions,
  }
})
