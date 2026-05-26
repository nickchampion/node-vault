import type { ApiHandler } from '@nodevault/platform.components.context'
import { base64Encode } from '@nodevault/platform.components.utils.server'
import { serverConfiguration, Contact } from '@nodevault/platform.components.nodevault.server'
import { createHttpClient } from '@nodevault/platform.components.utils'
import type { Response } from '@nodevault/platform.components.api'
import type { ContactRequestSchema } from '@nodevault/platform.components.nodevault.openapi'

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
    await client.post(`/${serverConfiguration.ntfy.topics.phone}`, contact, {
      headers: {
        Authorization: `Basic ${base64Encode(`${serverConfiguration.ntfy.username}:${serverConfiguration.ntfy.password}`)}`,
      },
    })
  } catch (error) {
    context.log.error(error)
  }

  return context.event.response.ok({ status: 'ok', message: 'Thank you for your message. We will be in touch shortly.' })
}
