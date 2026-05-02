

export type AuthTokens = {
  access: string | null
  refresh: string | null
  expiresIn: number
}

export type AuthInfo = {
  firstName: string | undefined
  lastName: string | undefined
  countryISO: string | undefined
  email: string | undefined
  //phone: Phone | undefined
  accountId: string | undefined
  //status: UserStatus | undefined
  //role: UserRole | undefined
}
