import { Account, User } from '@nodevault/platform.components.domain'
import { expiresInDays, toUtcIso } from '@nodevault/platform.components.utils'

export type AuthTokens = {
  access: string
  expiresAtUTC: string
}

export class AuthInfo extends User {
  expiresAtUTC: string
  account: Account

  constructor(user: User, account: Account) {
    super(user)
    this.expiresAtUTC = toUtcIso(expiresInDays(3))
    this.account = account
  }

  static guest() {
    return new AuthInfo(
      new User({
        firstName: 'Guest',
        status: 'active',
        roles: ['guest'],
      }),
      new Account({
        name: 'Guest',
      }),
    )
  }
}
