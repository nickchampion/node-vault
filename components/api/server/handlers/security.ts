import {
  EventSource,
  HectareError,
  type ImpersonationSession,
  Errors,
  extractUserPermissions,
  AuthInfo,
  collections
} from '@nodevault/platform.components.common'
import { configuration } from '@nodevault/platform.components.configuration'
import {
  decrypt,
  clone,
  base64Decode,
  shaHmacHash,
  invariantCultureCompare,
  base64Encode,
  createHash
} from '@nodevault/platform.components.utils'
import { cognito, createAuthInfoFromTokens } from '@nodevault/platform.integrations.cognito'
import { type Context as OpenApiContext, OpenAPIBackend } from 'openapi-backend'
import { OpenAPIV3 } from 'openapi-types'
import { DateTime } from 'luxon'
import type { Context } from '@nodevault/platform.components.context'
import axios from 'axios'
import { cache } from '@nodevault/platform.components.cache'

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseUser = async (ctx: OpenApiContext, authRequest: boolean): Promise<AuthInfo> => {
  const tokens = EventSource.getAuthTokens(ctx.request.headers)

  if ((!tokens || !tokens.access) && authRequest) {
    throw new HectareError(Errors.Auth.Unauthorised)
  }

  const accessToken = tokens?.access

  if ((!accessToken || accessToken === 'no-auth' || accessToken === configuration.basicAuth.password) && !authRequest) {
    return null
  }

  let user: AuthInfo

  // if the request does not require auth dont let the token validation throw just return null
  try {
    user = await createAuthInfoFromTokens(tokens)
  } catch (e) {
    if (!authRequest) return null
    throw e
  }

  if (user) {
    // if the user has muliple profiles and the organisationId header is set grant access to the profile org
    assignProfile(user, ctx.request.headers)

    if (user.administrator) {
      user = impersonate(ctx, user)
    }

    // verify the user has access to this endpoint
    if (authRequest) {
      authoriseRequest(ctx.operation.security, user.permissions)
    }

    return user
  }

  if (authRequest) throw new HectareError(Errors.Auth.Unauthorised)

  return null
}

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseApiToken = async (ctx: OpenApiContext, context: Context, token: string): Promise<AuthInfo> => {
  let tokenResponse: { expires: string; encryptedAuthInfo: string } | null = null

  try {
    // generate a hash of the ApiToken and use this to try to find the token from Customers service
    const tokenHash = createHash(Buffer.from(token, 'utf-8'))

    tokenResponse = await cache.get(
      `api-token-${tokenHash}`,
      async () => {
        const response = await axios.get<{ expires: string; encryptedAuthInfo: string }>(
          `${configuration.apiHost}/auth/user/api-tokens/${encodeURIComponent(tokenHash)}`
        )
        return response.data
      },
      configuration.cache.timeouts.fiveMinutes,
      configuration.cache.timeouts.fiveMinutes
    )
  } catch (e) {
    const message = e.response?.data?.validation?.[0]?.message
    throw new HectareError(Errors.Auth.Unauthorised, context.event, message)
  }

  const expiryTimeUTC = DateTime.fromISO(tokenResponse.expires).toUTC()

  if (expiryTimeUTC <= DateTime.utc()) {
    throw new HectareError(Errors.Auth.Unauthorised, context.event, 'Token has expired, please create a new token')
  }

  const user: AuthInfo = JSON.parse(
    decrypt(tokenResponse.encryptedAuthInfo, configuration.environment.key, configuration.environment.salt)
  )

  if (user) {
    authoriseRequest(ctx.operation.security, user.permissions)
    return user
  }

  throw new HectareError(Errors.Auth.Unauthorised)
}

/**
 * This is where we authenticate a user by taking the access and id tokens from the appropriate headers
 * verifying the tokens, extract the user information from them and authorising the request using the
 * permissioning system
 * @param api
 * @returns
 */
export const registerSecurityHandler = (api: OpenAPIBackend) => {
  api.registerSecurityHandler('jwt', async (ctx: OpenApiContext, context: Context) => {
    const token = String(ctx.request.headers['authorization'] || ctx.request.headers['Authorization'])
      ?.replace('Bearer ', '')
      ?.replace('bearer ', '')
      ?.trim()

    if (token.startsWith('hat_')) return authoriseApiToken(ctx, context, token.split('_')[1])

    return await authoriseUser(ctx, true)
  })

  api.registerSecurityHandler('basicAuth', async (ctx: OpenApiContext, context: Context) => {
    const auth = base64Decode(ctx.request.headers['authorization'].toString().replace('Basic ', '')).split(':')
    const signature = ctx.request.headers['x-payload-signature'] ? ctx.request.headers['x-payload-signature'].toString() : null

    // ensure the incoming credentials match our configured basic auth
    if (!invariantCultureCompare(configuration.basicAuth.username, auth[0]) || configuration.basicAuth.password !== auth[1]) {
      throw new HectareError(Errors.Auth.Unauthorised)
    }

    if (signature) {
      // hash and validate the incoming payload
      const base64EncodedHash = shaHmacHash(context.event.body, configuration.basicAuth.secret, 'sha256', true)

      if (signature !== base64EncodedHash && base64Encode(signature) !== base64EncodedHash) {
        throw new HectareError(Errors.Auth.Unauthorised)
      }
    }

    // login as admin for basic auth endpoints
    const authTokens = await cognito.admin.authenticate()
    const user = await createAuthInfoFromTokens(authTokens.tokens)
    authoriseRequest(ctx.operation.security, user.permissions)
    return user
  })

  return api
}

/**
 * If we have a valid impersonate token, decrypt it and swap AuthInfo, impersonated user (organisation owner)
 * needs to be set as the AuthInfo for the incoming request and the impersonators (admin user) AuthInfo is set to the
 * impersonator field so we know who is impersonating
 * @param ctx
 * @param authenticatedUser
 * @returns authenticated user (AuthInfo)
 */
const impersonate = (ctx: OpenApiContext, authenticatedUser: AuthInfo): AuthInfo => {
  const token = ctx.request.headers['x-impersonation'] as string

  if (!token) return authenticatedUser

  const decryptedToken = decrypt(token as string, configuration.environment.key, configuration.environment.salt)

  if (decryptedToken) {
    const session = JSON.parse(decryptedToken) as ImpersonationSession

    if (DateTime.fromISO(session.expiresAtUTC) < DateTime.utc()) {
      ctx['error'] = new HectareError(Errors.Auth.ImpersonationSessionExpired)
      throw ctx['error']
    }

    if (session.impersonatorEmail !== authenticatedUser.email) {
      ctx['error'] = new HectareError(Errors.Auth.ImpersonationSessionInvalid)
      throw ctx['error']
    }

    const authenticatedUserClone = clone(authenticatedUser)

    return new AuthInfo({
      ...session.impersonatedAuthInfo,
      impersonator: authenticatedUserClone,
      readonly: session.readonly
    })
  }

  return authenticatedUser
}

/**
 * Check to see if the authenticated user has access to the given endpoint
 * @param security OpenAPI endpoint security schema
 * @param userPermissions Array of permissions the user has
 * @returns true if user has access, otherwise an error
 */
export const authoriseRequest = (security: OpenAPIV3.SecurityRequirementObject[], permissions: string[]): boolean => {
  // extract the permissions set on the security for this endpoint
  const endpointPermissions = security.find(s => Object.prototype.hasOwnProperty.call(s, 'jwt'))?.jwt

  // if no permissions are set we just need a valid token
  if (!endpointPermissions || endpointPermissions.length === 0) return true

  // then see if the user has the required permissions to access this endpoint
  if (userHasAccess(permissions, endpointPermissions)) return true

  // // if we get here the user does not have access so throw a 'forbidden' error
  throw new HectareError(Errors.Auth.Forbidden)
}

/**
 * Genmerates a regular expression for each endpoint permission which matches either
 * the exact permission or allows wildcards to match groups of permissions. Then sees
 * if any of the users permissions match the regular expressions.
 * @param userPermissions
 * @param endpointPermissions
 * @returns
 */
const userHasAccess = (userPermissions: string[], endpointPermissions: string[]): boolean => {
  const regexes = endpointPermissions.map(p => {
    const parts = p.split(':')
    return new RegExp('^([' + parts[0] + '|*]+):([' + parts[1] + '|*]+):([' + getPermission(parts[2]) + ']+)$')
  })

  const userHasPermission = (userPermission: string) => {
    return regexes.find(r => r.test(userPermission))
  }

  if (userPermissions.find(p => userHasPermission(p))) return true
  return false
}

const getPermission = (permission: string) => {
  switch (permission) {
    case 'a':
      return 'a' // if endpoint permission is admin, user must have admin permission
    case 'w':
      return 'w|a' // if endpoint permission is write, user must have write or admin permissions
    default:
      return 'r|w|a' // if endpoint permission is read, user can have read, write or admin permissions
  }
}

/**
 * If the user has multiple profiles they can operate under multiple organisations
 * Here we are checking the users profiles against the x-organisation-id header
 * which tells us which org the user wants to operate under. If we find a matching
 * profile assume the roles / permissions and BUs for that profile, otherwise
 * just use the authenticated users default organisation profile
 * @param user
 * @param organisationId
 * @returns
 */
const assignProfile = (user: AuthInfo, headers: { [key: string]: string | string[] }) => {
  const organisationId = collections.organisations.id(headers['x-organisation-id'] as string)
  const profile = organisationId ? user.profiles?.find(p => p.organisationId === organisationId) : null

  if (profile) {
    user.roles = profile.roles
    user.permissions = extractUserPermissions(profile.roles)
    user.organisationId = profile.organisationId
    user.businesses = profile.businesses
    user.organisationName = headers['x-organisation-name'] as string
  }
}
