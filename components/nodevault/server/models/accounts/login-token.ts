import { BaseModel } from '@nodevault/platform.components.domain'

export class LoginToken extends BaseModel {
  userId!: string
  email!: string
  code!: string
  used: boolean = false

  constructor(fields?: Partial<LoginToken>) {
    super(LoginToken.index, 'LoginTokens')
    Object.assign(this, fields ?? {})
  }

  static index = 'LoginTokens'

  static id(id: string): string {
    return id && !id.includes('/') ? `LoginTokens/${id.toUpperCase()}` : id
  }
}
