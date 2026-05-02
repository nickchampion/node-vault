import { last, trimEnd } from '@nodevault/platform.components.utils'
import { URLSearchParams } from 'url'

export class StatelessQuerystring {
  elements: Record<string, string>
  uri: string

  constructor(uri: string) {
    this.parse(uri)
    this.uri = uri
  }

  parse(uri: string): void {
    const searchParams = new URLSearchParams(uri.includes('?') ? uri.split('?')[1] : [])

    this.elements = {}
    for (const p of searchParams) {
      this.elements[p[0]] = p[1]
    }
  }

  isLastElement(name: string) {
    return last(Object.keys(this.elements)) === name
  }

  encode(uri: string) {
    const parts = uri.split('?')
    const searchParams = new URLSearchParams(parts[1])
    let result = `${parts[0]}?`

    for (const p of searchParams) {
      result = `${result}${p[0]}=${encodeURIComponent(p[1])}&`
    }

    return trimEnd(result, '&')
  }

  getQuery(encode = false) {
    return Object.keys(this.elements)
      .reduce((current, key) => {
        current += `${key}=${encode ? encodeURIComponent(this.elements[key]) : this.elements[key]}&`
        return current
      }, '')
      .slice(0, -1)
  }

  get(key: string) {
    return this.elements[key]
  }

  contains(key: string) {
    return Object.prototype.hasOwnProperty.call(this.elements, key)
  }

  containsValue(key: string, value: string, delimeter: string = null) {
    if (!this.elements[key]) return false

    if (delimeter !== null) {
      return this.elements[key].split(delimeter).some(v => v.toLowerCase() === value)
    }

    return this.elements[key].toLowerCase() === value
  }

  remove(keys: string[], encode = false) {
    const u = keys.reduce((current, key) => {
      const regex = new RegExp('([?&]*)(' + key + ')=[^?&]+(&?)', 'g')
      return current.replace(regex, '$1')
    }, this.uri)
    return encode ? this.encode(trimEnd(u, '&')) : trimEnd(u, '&')
  }

  removeAll() {
    return trimEnd(this.remove(Object.keys(this.elements)), '?')
  }

  removeAllFacets() {
    return trimEnd(this.remove(Object.keys(this.elements).filter(k => k.startsWith('f:'))), '?')
  }

  replace(key: string, value: string) {
    const regex = new RegExp('([?&]*' + key + ')=[^?&]+', 'g')
    return this.uri.replace(regex, `$1=${value}`)
  }

  replaceMultiple(items: Record<string, string>) {
    return Object.keys(items).reduce((current, key) => {
      const regex = new RegExp('([?&]*)(' + key + ')=[^?&]+(&?)', 'g')
      return current.replace(regex, `$1=${items[key]}`)
    }, this.uri)
  }

  addOrReplace(key: string, value: string, encode = false) {
    if (this.contains(key)) return this.replace(key, value)
    const token = Object.keys(this.elements).length === 0 ? (this.uri.indexOf('?') > 0 ? '' : '?') : '&'
    const result = `${this.uri}${token}${key}=${value}`
    return encode ? this.encode(result) : result
  }
}

export class StatefulQuerystring extends StatelessQuerystring {
  constructor(uri: string) {
    super(uri)
  }

  remove(keys: string[]) {
    this.uri = super.remove(keys)

    keys.forEach(k => {
      delete this.elements[k]
    })

    return this.uri
  }

  replace(key: string, value: string) {
    this.uri = super.replace(key, value)
    this.elements[key] = value
    return this.uri
  }

  replaceMultiple(items: Record<string, string>) {
    this.uri = super.replaceMultiple(items)

    const keys = Object.keys(items)

    Object.keys(this.elements).forEach(k => {
      keys.forEach(rk => {
        if (rk === k) {
          this.elements[k] = items[rk]
        }
      })
    })

    return this.uri
  }

  addOrReplace(key: string, value: string) {
    if (this.contains(key)) return this.replace(key, value)

    this.uri = super.addOrReplace(key, value)
    this.elements[key] = value
    return this.uri
  }

  toStateless() {
    return new StatelessQuerystring(this.uri)
  }
}
