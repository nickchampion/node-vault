/**
 * Removes the specified character from beginning and end of the string
 * @param str
 * @param char
 * @returns
 */
export const trim = (str: string, char: string) => {
  let i = 0
  let j = str.length - 1
  while (str[i] === char) i++
  while (str[j] === char) j--
  return str.slice(i, j + 1)
}

export const normalisePostcode = (postcode?: string | null): string | null => {
  if (!postcode) return null

  const cleaned = postcode.toUpperCase().replaceAll(/[^A-Z0-9]/g, '')

  if (cleaned.length < 5 || cleaned.length > 7) return null

  const ukPostcodeRegex = /^(GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[ABD-HJLNP-UW-Z]{2})$/

  if (!ukPostcodeRegex.test(cleaned)) return null

  const outward = cleaned.slice(0, -3)
  const inward = cleaned.slice(-3)

  return `${outward} ${inward}`
}

/**
 * Trims the specified character from the end of the string
 * @param str
 * @param char
 * @returns
 */
export const trimEnd = (str: string, char: string) => {
  let j = str.length - 1
  while (str[j] === char) j--
  return str.slice(0, j + 1)
}

export const obfuscateBetweenIndexes = (str: string, start: number, end: number): string => {
  // Ensure start and end are within the string bounds and start is less than end
  if (start < 0 || end > str.length || start >= end) {
    return null
  }

  // Get the parts of the string before, within, and after the indexes
  const before = str.slice(0, start)
  const obfuscated = '*'.repeat(end - start)
  const after = str.slice(end)

  return before + obfuscated + after
}

/**
 * Trims the specified character from the end of the string
 * @param str
 * @param char
 * @returns
 */
export const trimStart = (str: string, char: string) => {
  let j = 0
  while (str[j] === char) j++
  return str.slice(j)
}

export const titleCaseFirst = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export const titleCase = (input: string) => {
  const output = input.toLowerCase().split(' ')
  for (let i = 0; i < output.length; i++) {
    output[i] = output[i].charAt(0).toUpperCase() + output[i].slice(1)
  }
  return output.join(' ')
}

export const format = (key: string, args: string | string[]) => {
  if (typeof args === 'string') {
    return key.replace(/\{0\}/g, args)
  }

  args.forEach((arrayItem, index) => {
    key = key.replace(`{${index}}`, arrayItem)
  })

  return key
}

export const invariantCultureCompare = (str1: string, str2: string): boolean => {
  return str1?.trim()?.toLowerCase() === str2?.trim()?.toLowerCase()
}

export const toAlphaNumeric = (input: string, replacement = '-'): string => {
  return input ? input.trim().replace(/[\W]+/g, replacement) : null
}

export const splitByCamelCase = (input: string, replacement = ' ') => {
  return input.replace(/([A-Z])/g, `${replacement}$1`)
}

export const camelToSnakeCase = str => str.replace(/[A-Z0-9]/g, letter => `_${letter.toLowerCase()}`)
export const snakeToCamelCase = str => {
  return str.replace(/([-_][a-z0-9])/gi, $1 => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

export const tryParseInt = (str: string, defaultValue = 0): number => {
  try {
    return parseInt(str)
  } catch {
    return defaultValue
  }
}

export const tryParseFloat = (str: string, defaultValue = 0): number => {
  try {
    return parseFloat(str)
  } catch {
    return defaultValue
  }
}

export const tryParseBool = (str: string, defaultValue = null): boolean => {
  try {
    if (['true', 'y', 'yes'].includes(str.toLowerCase())) {
      return true
    } else if (['false', 'n', 'no'].includes(str.toLowerCase())) {
      return false
    }

    return defaultValue
  } catch {
    return defaultValue
  }
}

export const isPhoneNumber = (input: string) => {
  return /^[0-9 +]+$/.test(input.trim())
}

export const isNumericString = (input: string) => {
  return /^[0-9]+$/.test(input.trim())
}

export const removeCharsFromString = (input: string, charsToRemove: string[]): string => {
  // Create a Set for faster lookup of characters to remove
  const charsSet = new Set(charsToRemove)

  // Filter out characters that are in the charsSet
  const result = input
    .split('')
    .filter(char => !charsSet.has(char))
    .join('')

  return result
}
