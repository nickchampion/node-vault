import type { ZodSchema } from 'zod'
import type { FormError } from '@nuxt/ui'

export const zodValidate = <T>(schema: ZodSchema<T>) => (state: unknown): FormError[] => {
  const result = schema.safeParse(state)

  if (result.success) return []

  return result.error.issues.map(issue => ({
    name: issue.path.join('.'),
    message: issue.message,
  }))
}
