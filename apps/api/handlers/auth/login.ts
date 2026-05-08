import { randomUUID } from 'node:crypto'
import type { ApiHandler } from '@nodevault/platform.components.context'
import type { Response } from '@nodevault/platform.components.api.server'
import { LoginToken, User } from '@nodevault/platform.components.domain'
import { toUtcIso, expiresInSeconds } from '@nodevault/platform.components.utils'
import { serverConfiguration } from '@nodevault/platform.components.configuration.server'
import { base64Encode, encrypt } from '@nodevault/platform.components.utils.server'
import { CONSTANTS } from 'ravendb'
import { createResendClient } from '@nodevault/platform.integrations.resend'

const TOKEN_TTL_SECONDS = 10 * 60

export const authLogin: ApiHandler = async (context): Promise<Response> => {
  const { email } = context.event.payload

  const user = await context.session
    .query(User)
    .whereEquals('email', email.toLowerCase().trim())
    .firstOrNull()

  if (!user) {
    return context.event.response.ok()
  }

  const loginToken = new LoginToken({
    userId: user.id,
    email: user.email,
    used: false,
  })

  await context.session.store(loginToken)

  const code = encrypt(`${User.friendlyId(loginToken.id)}_${randomUUID()}`, serverConfiguration.environment.key, serverConfiguration.environment.salt)

  const metadata = context.session.database.advanced.getMetadataFor(loginToken)

  // Set the '@expires' metadata property so the token is deleted after 10 mninutes
  metadata[CONSTANTS.Documents.Metadata.EXPIRES] = toUtcIso(expiresInSeconds(TOKEN_TTL_SECONDS))

  const resend = createResendClient()

  const html = await resend.render('/emails/login', {
    name: user.firstName ?? user.email!,
    code: base64Encode(code),
  })

  await resend.send({
    to: user.email!,
    subject: 'Your NodeVault sign-in link',
    html,
  })

  return context.event.response.ok()
}
