import { BaseModel } from '../base.js'

export type AccountStatus = 'active' | 'deleted'

export class Account extends BaseModel {
  status!: AccountStatus
  name!: string

  constructor(fields?: Partial<Account>) {
    super(Account.index, 'accounts')
    Object.assign(this, fields ?? {})
  }

  static id(id: string): string {
    return id && !id.includes('/') ? `accounts/${id.toUpperCase()}` : id
  }

  static index = 'Accounts'
}
