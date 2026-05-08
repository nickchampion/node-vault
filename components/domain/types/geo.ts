export type Country = {
  name: string
  iso: string
  enabled: boolean
  currency: string
  countryCode: string
  locale: string
  continent: 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Australasia'
}
