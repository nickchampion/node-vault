import { roundToLoadWeightKG } from './weight.js'

describe('Weight rounding', () => {
  it('should round to the nearest 29t - 110t to 118t', () => {
    const result = roundToLoadWeightKG(110000)

    expect(result).toBe(116000)
  })

  it('should round to the nearest 29t - 88t to 87t', () => {
    const result = roundToLoadWeightKG(88000)

    expect(result).toBe(87000)
  })

  it('should round to the nearest 29t - 0t to 29t', () => {
    const result = roundToLoadWeightKG(0)

    expect(result).toBe(29000)
  })
})
