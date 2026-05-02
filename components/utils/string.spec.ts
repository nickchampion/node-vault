import { trim, trimEnd } from './string.js'

describe('String Tests', () => {
  test('Trim removes the correct characters', () => {
    expect(trim('1-nick1', '1')).toBe('-nick')
    expect(trim('HectareH', 'h')).toBe('HectareH') //case sensitive
    expect(trim('HectareH', 'H')).toBe('ectare')
    expect(trimEnd('HectareH', 'H')).toBe('Hectare')
  })
})
