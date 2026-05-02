import { BaseModel, collections } from '@nodevault/platform.components.common'
import type { IDocumentQuery } from 'ravendb'
import type { ISearchFilter } from './searchFilter.js'

export class StandardFilter implements ISearchFilter {
  name: string
  negate: boolean
  terms: string[]
  operator: 'AND' | 'OR' = 'OR' // default operator for standard filters

  constructor(name: string, terms: string[], operator?: 'AND' | 'OR') {
    this.name = name
    this.terms = collections.map(this.name, terms) as string[]
    this.operator = operator || this.operator
  }

  matches(term: string) {
    return term && this.terms ? this.terms.some(t => t.toLowerCase() === term.toLowerCase()) : false
  }

  apply(query: IDocumentQuery<BaseModel>): IDocumentQuery<BaseModel> {
    if (this.terms && this.terms.length > 0) {
      query = this.negate ? query.not().openSubclause() : query.openSubclause()
      this.terms.forEach((term, i) => {
        query = (i > 0 ? (this.operator === 'OR' ? query.orElse() : query.andAlso()) : query).whereEquals(this.name, term)
      })
      query = query.closeSubclause()
    }

    return query
  }
}
