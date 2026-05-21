import type { AsyncDataOptions, AsyncData, NuxtError } from 'nuxt/app'
import type { UseAsyncStateOptions } from '@vueuse/core'
import type { ApiResponse } from '@nodevault/platform.components.nodevault.client'
import { simpleHash, serializeValue } from '@nodevault/platform.components.utils'
import type { openapi } from '@nodevault/platform.components.domain'

export type AsyncDataHandler<T, TParams = undefined> = TParams extends undefined
  ? () => Promise<ApiResponse<T>>
  : (params: TParams) => Promise<ApiResponse<T>>

export type AsyncDataOptionsExtras<T> = {
  onSuccess?: (response: ApiResponse<T>) => void | Promise<void>
  onError?: (error: openapi.models.StandardResponseSchema) => void | Promise<void>
  cacheKey?: string | (() => string)
  cacheTtlSeconds?: number
}

export type AsyncApiDataOptions<T> = AsyncDataOptions<T> & AsyncDataOptionsExtras<T>

export type AsyncApiDataResponse<T> = AsyncData<T, NuxtError<openapi.models.StandardResponseSchema>>

export function useAsyncApiState<T>(action: () => Promise<ApiResponse<T>>, options: UseAsyncStateOptions<true, ApiResponse<T>> | undefined = {}) {
  const { state, execute, isLoading } = useAsyncState<ApiResponse<T>>(
    async () => {
      const response = await action()

      if (response?.success) {
        options.onSuccess?.(response)
      }

      return response
    },
    null as any,
    options,
  )

  const data = computed<T | null>(() => (state.value?.success ? state.value?.data as T : null))
  const error = computed(() => (state.value?.success ? null : state.value?.error ?? null))
  const loading = computed(() => isLoading.value)

  return {
    data,
    error,
    pending: loading,
    loading,
    execute,
  }
}

export function useAsyncApiData<T, TParams = undefined>(
  handler: AsyncDataHandler<T, TParams>,
  params?: TParams extends undefined ? undefined : MaybeRef<TParams>,
  options?: AsyncApiDataOptions<T>,
): AsyncApiDataResponse<T> {
  const cacheKey = computed(() => {
    return createCacheKey(handler, params ? toValue(params as MaybeRef<TParams>) : undefined, options)
  })

  const result = useAsyncData(() => cacheKey.value, async () => {
    const resolvedParams = params ? toValue(params as MaybeRef<TParams>) : undefined

    const response = resolvedParams
      ? await (handler as (params: TParams) => Promise<ApiResponse<T>>)(resolvedParams!)
      : await (handler as () => Promise<ApiResponse<T>>)()

    if (response.error) {
      if (options?.onError) {
        await options.onError(response.error)
      }

      throw createError<openapi.models.StandardResponseSchema>({
        statusCode: response.httpStatus,
        statusMessage: response.error.message ?? 'An unknown error has occurred',
        data: response.error,
      })
    }

    if (options?.onSuccess) {
      await options.onSuccess(response)
    }

    return response.data as T
  }, options as any) as any as AsyncData<T, NuxtError<openapi.models.StandardResponseSchema>>

  if (!import.meta.client) return result

  if (options?.cacheKey) {
    // Auto-cleanup for TTL cached data - remove 500ms before expiry
    setTimeout(() => {
      expireCacheItem(cacheKey.value)
    }, ((options.cacheTtlSeconds ?? 300) * 1000) - 500) // default to 5 minutes TTL if not specified
  } else {
    // Auto-cleanup for non-cached data to prevent memory accumulation
    onScopeDispose(() => {
      expireCacheItem(cacheKey.value)
    })
  }

  return result
}

export function useLazyAsyncApiData<T, TParams = undefined>(
  handler: AsyncDataHandler<T, TParams>,
  params?: TParams extends undefined ? undefined : MaybeRef<TParams>,
  options?: AsyncApiDataOptions<T>,
): AsyncApiDataResponse<T> {
  const mergedOptions = options ? { ...options, lazy: true } : { lazy: true }

  return useAsyncApiData<T, TParams>(handler, params, mergedOptions)
}

const expireCacheItem = (key: string) => {
  const nuxtApp = useNuxtApp()

  delete nuxtApp.payload.data?.[key]
}

const createCacheKey = <T, TParams>(fn: AsyncDataHandler<T, TParams>, params?: TParams, options?: AsyncApiDataOptions<T>): string => {
  if (options?.cacheKey) {
    return typeof options.cacheKey === 'function' ? options.cacheKey() : options.cacheKey
  }

  // Create base key with cached function hash
  const baseKey = `${fn.name || 'fn'}_${simpleHash(fn.toString())}`

  // If no params, return function-based key
  if (!params) {
    return baseKey
  }

  // Hash params for uniqueness
  const hash = simpleHash(serializeValue(params))

  return `${baseKey}:${hash}`
}
