import { BaseModel } from './base-model.js'

const generate = (id: string, prefix: string) => (id ? `${prefix}/${BaseModel.friendlyId(id)!.toUpperCase()}` : null)

const mapIds = (terms: string[] | string, fn: (id: string) => string | null) => {
  if (Array.isArray(terms)) {
    return terms.flatMap((t) => {
      const id = fn(t)

      return id ? [id] : []
    })
  }

  return fn(terms) ?? terms
}

/**
 * Central place to hold information about collection so we dont need to share model.
 */
export const collections = {
  accounts: {
    id: (id: string) => generate(id, 'organisations'),
  },
  users: {
    id: (id: string) => generate(id, 'users'),
  },
  map: (fieldName: string, terms: string[] | string): string[] | string => {
    switch (fieldName.toLowerCase()) {
      case 'accountid': {
        return mapIds(terms, collections.accounts.id)
      }

      case 'userid': {
        return mapIds(terms, collections.users.id)
      }

      default: {
        return terms
      }
    }
  },
}
