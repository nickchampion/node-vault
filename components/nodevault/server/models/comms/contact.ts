import { BaseModel, type Phone } from '@nodevault/platform.components.domain'

export class Contact extends BaseModel {
  name!: string
  email!: string
  phone?: Phone | null
  interests?: Array<'grapheneos' | 'umbrelos' | 'business' | 'other'>
  message!: string

  constructor(fields?: Partial<Contact>) {
    super(Contact.index, 'contacts')

    if (fields?.email) fields.email = fields.email.toLowerCase()

    Object.assign(this, fields ?? {})
  }

  static id(id: string): string {
    return id && !id.includes('/') ? `contacts/${id.toUpperCase()}` : id
  }

  static index = 'Contacts'
}
