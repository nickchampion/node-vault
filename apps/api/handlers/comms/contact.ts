import type { ApiHandler } from '@nodevault/platform.components.context'
import type { Response } from '@nodevault/platform.components.api.server'
import { base64Encode } from '@nodevault/platform.components.utils.server'
import type { ContactRequestSchema } from '@nodevault/platform.components.api.schemas'
import { Contact } from '@nodevault/platform.components.domain'
import { createHttpClient } from '@nodevault/platform.components.utils'
import { serverConfiguration } from '@nodevault/platform.components.configuration.server'

export const commsContact: ApiHandler = async (context): Promise<Response> => {
  const payload = context.event.payload as ContactRequestSchema

  const contact = new Contact({
    email: payload.email,
    phone: payload.phone,
    name: payload.name,
    message: payload.message,
    interests: payload.interests,
  })

  await context.session.store(contact)

  const client = createHttpClient(serverConfiguration.ntfy.host)

  try {
    await client.post(serverConfiguration.ntfy.topics.phone, contact, {
      headers: {
        Authorization: base64Encode(`${serverConfiguration.ntfy.username}:${serverConfiguration.ntfy.password}`),
      },
    })
  } catch (error) {
    context.log.error(error)
  }

  return context.event.response.ok({ status: 'ok', message: 'Thank you for your message. We will be in touch shortly.' })
}
