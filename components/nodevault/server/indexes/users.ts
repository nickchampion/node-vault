import type { User } from '@nodevault/platform.components.nodevault.server'
import { AbstractJavaScriptIndexCreationTask } from 'ravendb'

export class Users extends AbstractJavaScriptIndexCreationTask<User> {
  constructor() {
    super()

    this.searchEngineType = 'Corax'
    this.map('Users', (user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ? user.phone.number : null,
        createdAtUTC: new Date(user.createdAtUTC!),
      }
    })
  }
}
