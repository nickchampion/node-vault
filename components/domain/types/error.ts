export type ErrorType = 'auth' | 'validation' | 'notfound' | 'conflict' | 'internal'

export class AppError extends Error {
  constructor(
    public readonly kind: ErrorType,
    message: string,
    public readonly statusCode: number = 500,
    public override readonly cause?: unknown,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'You are not authorised to access this resource', cause?: unknown) {
    super('auth', message, 403, cause)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown, details?: Record<string, unknown>) {
    super('validation', message, 400, cause, details)
    this.name = 'ValidationError'
  }
}

export class GeneralError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('internal', message, 500, cause)
    this.name = 'GeneralError'
  }
}

/**
 * Wrap any thrown value as an AppError. Call this once at your boundary
 * (middleware / handler) so the rest of the system only deals with AppError.
 */
export const normalizeError = (err: unknown): AppError => {
  if (err instanceof AppError) return err

  if (err instanceof Error) return new GeneralError(err.message, err)

  if (typeof err === 'string') return new GeneralError(err)

  return new GeneralError('Unknown error', err)
}
