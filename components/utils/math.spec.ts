import { typicalPrice, type PriceRange } from './math.js'

describe('Math Tests', () => {
  it('Calculates the correct typical price for price ranges', () => {
    const input: PriceRange[] = [
      {
        highest: 115,
        lowest: 108,
        close: 50,
        closeAtUtc: '2024-11-27T15:00:00.000Z'
      },
      {
        highest: 120,
        lowest: 107,
        close: 50,
        closeAtUtc: '2024-11-28T16:00:00.000Z'
      },
      {
        highest: 117,
        lowest: 115,
        close: 118,
        closeAtUtc: '2024-11-29T17:00:00.000Z'
      }
    ]

    // should be 118 (last close) + 120 (highest) + 107 (lowest) / 3 = 115
    const result = typicalPrice(input)

    expect(result).toBe(115)
  })
})
