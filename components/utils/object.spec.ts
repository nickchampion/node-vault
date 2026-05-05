import { camelToSnakeCase, snakeToCamelCase } from './string.js'
import { convertKeys } from './object.js'

describe('Convert keys tests', () => {
  test('Convert to camel and back to snake', () => {
    const source = {
      id: 'seller-321',
      status: 'PENDING',
      legal_name: 'Coolstore GmbH',
      business_registration_number: 'HRB654321B',
      tax_number: '12/345/67890',
      email: 'coolstore@example.com',
      phone: '+49987654321',
      legal_address: {
        address_line_1: 'Mustergasse 123',
        postal_code: '55441',
        city: 'Musterhausen',
        state: 'Niedersachsen',
        country: 'DEU',
      },
      bank_accounts: [
        {
          iban: 'string',
          bic: 'string',
          currency: 'EUR',
        },
        {
          sort_code: 'string',
          account_number: 'string',
          bank_code: 'string',
          currency: 'GBP',
        },
      ],
    }

    const camel = convertKeys(source, snakeToCamelCase)
    const snake = convertKeys(camel, camelToSnakeCase)

    expect(source).toMatchObject(snake as object)
  })
})
