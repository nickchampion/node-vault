import {
  InboundEvent,
} from '@nodevault/platform.components.context'
import type { OpenAPIBackend, Context as OpenApiContext } from 'openapi-backend'
import type { OpenAPIV3 } from 'openapi-types'
import type { User } from '@nodevault/platform.components.domain'
import { AuthError } from '@nodevault/platform.components.domain'
import { decrypt } from '@nodevault/platform.components.utils'
import { serverConfiguration } from '@nodevault/platform.components.configuration.server'

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseUser = async (ctx: OpenApiContext, authRequest: boolean): Promise<User | null> => {
  const tokens = InboundEvent.getAuthTokens(ctx.request.headers)

  if ((!tokens || !tokens.access) && authRequest) {
    throw new AuthError()
  }

  const decryptedAuthToken = decrypt(tokens.access!, serverConfiguration.environment.key, serverConfiguration.environment.salt)

  if (!decryptedAuthToken) throw new AuthError()

  const user = JSON.parse(decryptedAuthToken) as User

  if (user) {
    // verify the user has access to this endpoint
    if (authRequest) {
      authoriseRequest(ctx.operation.security ?? [], user.roles)
    }

    return user
  }

  if (authRequest) throw new AuthError()

  return null
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
    return await authoriseUser(ctx, true)
  })

  return api
}

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseRequest = (security: OpenAPIV3.SecurityRequirementObject[], roles: string[]): boolean => {
  // extract the permissions set on the security for this endpoint
  const endpointRoles = security.find(s => Object.prototype.hasOwnProperty.call(s, 'jwt'))?.jwt

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
