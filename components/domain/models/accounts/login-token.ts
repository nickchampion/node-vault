import { BaseModel } from '../base.js'

export class LoginToken extends BaseModel {
  userId!: string
  email!: string
  code!: string
  used: boolean = false

  constructor(fields?: Partial<LoginToken>) {
    super(LoginToken.index, 'login-tokens')
    Object.assign(this, fields ?? {})
  }

  static index = 'LoginTokens'

  static id(id: string): string {
    return id && !id.includes('/') ? `tokens/${id.toUpperCase()}` : id
  }
}
