import { Lazy } from 'ravendb'

/**
 * Pause execution for the given number of milliseconds.
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check whether a value is a thenable (Promise-like).
 */
export const isPromise = <T = unknown>(value: any): value is Promise<T> => {
  return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function'
}

/**
 * Wrap a static value in a RavenDB Lazy so callers can treat it the same as an actual lazy
 * query result. Useful for skipping queries while keeping the consumer's API uniform.
 */
export const fakeLazy = <T>(value: T): Lazy<T> => new Lazy<T>(() => Promise.resolve(value))
