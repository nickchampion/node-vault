import type { Phone } from '../../types/index.js'
import { BaseModel } from '../base.js'

export type UserStatus = 'active' | 'deleted'
export type UserRole = 'guest' | 'user' | 'admin'

export class User extends BaseModel {
  firstName!: string
  lastName!: string
  countryISO!: string
  email!: string
  phone: Phone | null = null
  accountId!: string
  status!: UserStatus
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
