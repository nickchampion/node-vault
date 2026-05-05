import { utils } from './utils.js'

describe('RavenDB Util Tests', () => {
  test('utils.patch correctly replaces nested properties, without overriding missing fields', async () => {
    const doc = {
      name: 'Test',
      id: 1,
      age: 32,
      address: {
        line1: '14 Brick Lane',
        postcode: 'EC1 3GH',
        coordinates: {
          lon: 1.2222222,
          lat: 0.5555,
          stuff: {
            override: true,
            ignore: 'false',
          },
        },
      },
    }

    const patch = {
      id: 2,
      name: 'bob',
      address: {
        postcode: 'test',
        coordinates: {
          stuff: {
            override: false,
          },
        },
      },
    }

    const patched = utils.patchDocument(doc, patch)

    expect(patched.id).toBe(2)
    expect(patched.name).toBe('bob')
    expect(patched.age).toBe(32)
    expect(patched.address.postcode).toBe('test')
    expect(patched.address.line1).toBe('14 Brick Lane')
    expect(patched.address.coordinates.lon).toBe(1.2222222)
    expect(patched.address.coordinates.stuff.override).toBe(false)
    expect(patched.address.coordinates.stuff.ignore).toBe('false')
  })
})
