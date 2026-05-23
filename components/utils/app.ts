export const isCloudflareWorker = () => {
  return typeof globalThis !== 'undefined'
    && typeof globalThis.fetch === 'function'
    && globalThis.document === undefined
    && globalThis.WorkerGlobalScope !== undefined
}
