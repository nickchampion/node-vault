import type { AuthInfo } from '@nodevault/platform.components.context'
import {
  InboundEvent,
} from '@nodevault/platform.components.context'
import type { OpenAPIBackend, Context as OpenApiContext } from 'openapi-backend'
import { AuthError } from '@nodevault/platform.components.domain'
import { createAuthInfoFromToken } from '@nodevault/platform.components.utils.server'
import { isExpired } from '@nodevault/platform.components.utils'
import { toDate } from 'date-fns'

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseUser = async (ctx: OpenApiContext): Promise<AuthInfo | null> => {
  const token = InboundEvent.getAuthToken(ctx.request.headers)
  const endpointRoles = ctx.operation.security?.find(s => Object.prototype.hasOwnProperty.call(s, 'jwt'))?.jwt ?? []

  if (!token && endpointRoles.length > 0) {
    throw new AuthError()
  }

  const authInfo = createAuthInfoFromToken(token)

  if (endpointRoles.length > 0 && isExpired(toDate(authInfo.expiresAtUTC))) {
    throw new AuthError()
  }

  // verify the user has access to this endpoint if the endpoint has roles assigned
  if (endpointRoles.length > 0) {
    authoriseRequest(endpointRoles, authInfo!.roles)
  }

  return authInfo
}

/**
 * This is where we authenticate a user by taking the access and id tokens from the appropriate headers
 * verifying the tokens, extract the user information from them and authorising the request using the
 * permissioning system
 * @param api
 * @returns
 */
export const registerSecurityHandler = (api: OpenAPIBackend) => {
  api.registerSecurityHandler('jwt', async (ctx: OpenApiContext) => {
    return await authoriseUser(ctx)
  })

  return api
}

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseRequest = (endpointRoles: string[], roles: string[]): boolean => {
  // if no permissions are set we just need a valid token
  if (!endpointRoles || endpointRoles.length === 0) return true

  // then see if the user has the required permissions to access this endpoint
  if (userHasAccess(roles, endpointRoles)) return true

  // // if we get here the user does not have access so throw a 'forbidden' error
  throw new AuthError()
}

/**
 * Checks if the user has the required role for the endpoint
 * @param userRoles
 * @param endpointRoles
 * @returns
 */
const userHasAccess = (userRoles: string[], endpointRoles: string[]): boolean => {
  return userRoles.some(r => endpointRoles.includes(r))
}
