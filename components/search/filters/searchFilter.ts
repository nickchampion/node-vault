import type { IDocumentQuery } from 'ravendb'
import type { BaseModel } from '@nodevault/platform.components.domain'

export interface ISearchFilter {
  negate: boolean | undefined
  name: string
  terms: string[]
  operator: 'AND' | 'OR'
  matches: (term: string) => boolean
  apply: (query: IDocumentQuery<BaseModel>) => IDocumentQuery<BaseModel>
}
