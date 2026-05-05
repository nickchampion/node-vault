import { BaseModel } from '../base.js'
import type { Phone } from '../common.js'

export type UserStatus = 'active' | 'deleted'
export type UserRole = 'user' | 'admin'

export class User extends BaseModel {
  firstName: string | undefined
  lastName: string | undefined
  countryISO: string | undefined
  email: string | undefined
  phone: Phone | undefined
  accountId: string | undefined
  status: UserStatus | undefined
  roles: UserRole[] = []

  constructor(fields?: Partial<User>) {
    super(User.index, 'users')

    if (fields?.email) fields.email = fields.email.toLowerCase()

    Object.assign(this, fields ?? {})
  }

  static id(id: string): string {
    return id && !id.includes('/') ? `users/${id.toUpperCase()}` : id
  }

  static index = 'Users'
}
