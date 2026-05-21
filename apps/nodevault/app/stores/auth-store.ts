import type { ApiOptions, ApiResponse } from '@nodevault/platform.components.nodevault.client'
import type { UserSchema, VerifyLoginSchema } from '@nodevault/platform.components.nodevault.openapi'
import { isFutureDate, toUtcIso } from '@nodevault/platform.components.utils'

export const useAuthStore = defineStore('auth', () => {
  const device = useDevice()
  const config = useConfig()

  const cookieOptions = {
    secure: config.environment !== 'dev',
    maxAge: 30 * 24 * 60 * 60,
  }

  const auth = useCookie<string | null>('nodevault-auth', cookieOptions)
  const expires = useCookie<string | null>('nodevault-expires', cookieOptions)
  const userCookie = useCookie<UserSchema | null>('nodevault-user', cookieOptions)

  const user = ref<UserSchema | null>(userCookie.value ?? null)

  const isCloudflareWorker = () => {
    return typeof globalThis !== 'undefined'
      && typeof globalThis.fetch === 'function'
      && globalThis.document === undefined
      && globalThis.WorkerGlobalScope !== undefined
  }

  const cookies = [
    { ref: auth, key: 'nodevault-auth' },
    { ref: expires, key: 'nodevault-expires' },
    { ref: userCookie, key: 'nodevault-user' },
  ]

  const authenticated = (): boolean => {
    return auth.value != null && expires.value != null && isFutureDate(expires.value)
  }

  const apiOptions = (): ApiOptions => {
    return {
      tokens: {
        access: auth.value,
        refresh: null,
      },
      device: determineDeviceInfo(device),
      baseUri: isCloudflareWorker() ? config.platform.api : config.platform.apiProxy,
      version: config.version,
    }
  }

  const logout = () => {
    auth.value = null
    expires.value = null
    userCookie.value = null
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
      userCookie.value = verifyResponse.data.user
    }
  }

  const setUser = (updated: UserSchema) => {
    user.value = updated
    userCookie.value = updated
  }

  const userHasRole = (role: UserSchema['roles'][number]): boolean => {
    return user.value?.roles.includes(role) ?? false
  }

  return {
    auth,
    expires,
    user,
    logout,
    setAuthTokens,
    setUser,
    authenticated,
    userHasRole,
    apiOptions,
  }
})
