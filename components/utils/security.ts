/* eslint-disable quotes */
import * as crypto from 'crypto'
import fs from 'node:fs'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const numbers = '0123456789'

const keys = {
  salt: 'H3ct4r3Sa1t',
  nonce: 10,
  iv: 16,
  algorithm: 'sha512',
  iterations: 100000,
  length: 48
}

const htmlEntities = {
  amp: '&',
  apos: "'",
  lt: '<',
  gt: '>',
  quot: '"',
  nbsp: '\xa0'
}

const htmlEntityPattern = /&([a-z]+);/gi

const getKey = (key: string, salt?: string) => {
  return crypto.pbkdf2Sync(key, salt || keys.salt, 10000, 32, 'sha512')
}

export const createMD5FileHash = (path: string) => {
  const fileBuffer = fs.readFileSync(path)
  return createHash(fileBuffer)
}

export const createHash = (buffer: Buffer) => crypto.createHash('sha256').update(buffer).digest('base64')

export const createMD5Hash = (payload: string) => crypto.createHash('md5').update(payload).digest('base64')

export const shaHmacHash = (data: string, secretKey: string, algorithm = 'sha512', base64: boolean = false) => {
  const hmac = crypto.createHmac(algorithm, secretKey)
  const hashedData = hmac.update(data)
  return hashedData.digest(base64 ? 'base64' : 'hex')
}

export const hash = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex').replace('$', '')
  const hashed = crypto.pbkdf2Sync(password, salt, keys.iterations, keys.length, keys.algorithm)
  return `${hashed.toString('hex')}$${salt}$${keys.iterations}$${keys.algorithm}`
}

export const compare = (clearPassword: string, storedPassword: string) => {
  const parts = storedPassword.split('$')
  const algorithm = parts[parts.length - 1]
  const iterations = parseInt(parts[parts.length - 2])
  const salt = parts[parts.length - 3]
  const originalPassword = storedPassword.split(`$${salt}`)[0]

  const hashedPassword = crypto.pbkdf2Sync(clearPassword, salt, iterations, keys.length, algorithm)

  return hashedPassword.toString('hex') === originalPassword
}

export const randomId = (prefix?: string) => {
  return prefix ? `${prefix}/${randomNumbers(8)}-A` : `${randomNumbers(8)}-A`
}

export const randomHex = (length?: number) => {
  const chars = length ?? 32
  return crypto
    .randomBytes(Math.ceil(chars / 2))
    .toString('hex')
    .slice(0, chars)
}

export const base64UUID = () => {
  return base64Encode(crypto.randomUUID())
}

export const randomPassword = () => {
  return `${randomCharacters(4).toUpperCase()}${randomCharacters(3).toLowerCase()}${randomNumbers(3)}!`
}

export const randomCharacters = (length: number) => {
  const bytes = crypto.randomBytes(length)
  const chars = []

  for (let i = 0; i < bytes.length; i += 1) {
    chars.push(letters[bytes[i] % letters.length])
  }

  return chars.join('')
}

export const randomAlphaNumeric = (length: number, prefix: string = '') => {
  const bytes = crypto.randomBytes(length)
  const chars = []

  for (let i = 0; i < bytes.length; i += 1) {
    chars.push(set[bytes[i] % set.length])
  }

  return prefix ? prefix + chars.join('') : chars.join('')
}

export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomNumbers = (length: number, start: string = '1'): number => {
  const bytes = crypto.randomBytes(length - 1)
  // start with non zero otherwise parseInt with leading zero can end up with a number shorter that what we asked for
  const chars: string[] = [start]

  for (let i = 0; i < bytes.length; i += 1) {
    chars.push(numbers[bytes[i] % numbers.length])
  }

  return parseInt(chars.join(''))
}

export const randomPhoneNumber = (length: number = 10): string => {
  const number = randomNumbers(length)
  return `+44 ${number}`
}

export const randomPhoneNumberNoSpace = (length: number = 8): string => {
  const number = randomNumbers(length)
  return `+44${number}`
}

export const randomPhoneNumberObject = (length: number = 8) => {
  const number = randomNumbers(length)
  return {
    callingCode: '+44',
    number: `+44${number}`
  }
}

type EmailAddressOptions = {
  length?: any
  suffix?: any
}

export const randomEmailAddress = (options?: EmailAddressOptions): string => {
  const appendix = options?.suffix
    ? randomAlphaNumeric(options?.length ?? 4) + options.suffix
    : randomAlphaNumeric(options?.length ?? 10)
  return `testing+${appendix.toLowerCase()}@wearehectare.com`
}

export const hashCode = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i += 1) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const base64Encode = (input: string) => {
  const buffer = Buffer.from(input, 'utf8')
  return buffer.toString('base64')
}

export const base64Decode = (input: string) => {
  const buffer = Buffer.from(input, 'base64')
  return buffer.toString('utf8')
}

export const encrypt = (text: string, key: string, salt?: string) => {
  const cryptoKey = getKey(key, salt)
  const nonce = crypto.randomBytes(keys.nonce)
  const iv = Buffer.alloc(keys.iv)
  nonce.copy(iv)

  const cipher = crypto.createCipheriv('aes-256-ctr', cryptoKey, iv)
  const encrypted = cipher.update(text.toString())
  const message = Buffer.concat([nonce, encrypted, cipher.final()])
  return message.toString('base64')
}

export const decrypt = (text: string, key: string, salt?: string) => {
  try {
    const cryptoKey = getKey(key, salt)
    const message = Buffer.from(text, 'base64')
    const iv = Buffer.alloc(keys.iv)
    message.copy(iv, 0, 0, keys.nonce)
    const encryptedText = message.slice(keys.nonce)
    const decipher = crypto.createDecipheriv('aes-256-ctr', cryptoKey, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  } catch {
    return null
  }
}

export const decodeHTML = (text: string) => {
  // A single replace pass with a static RegExp is faster than a loop
  return text.replace(htmlEntityPattern, function (match, entity) {
    entity = entity.toLowerCase()

    if (Object.prototype.hasOwnProperty.call(htmlEntities, entity)) {
      return htmlEntities[entity]
    }
    // return original string if there is no matching entity (no replace)
    return match
  })
}
