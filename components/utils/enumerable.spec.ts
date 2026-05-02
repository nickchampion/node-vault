import { groupBy } from './enumerable.js'

describe('Enumerable Tests', () => {
  it('GroupBy returns correct object structure and array length', () => {
    const input = [
      {
        database: 'customers',
        api: {
          name: 'customers',
          url: 'https://customers.farmto.com'
        }
      },
      {
        database: 'customers',
        api: {
          name: 'customers',
          url: 'https://customers.farmto.com'
        }
      },
      {
        database: 'system',
        api: {
          name: 'system',
          url: 'https://system.farmto.com'
        }
      }
    ]

    const databases = groupBy(Object.values(input), 'database')
    expect(databases['customers'].length).toBe(2)
    expect(databases['system'].length).toBe(1)
  })
})
