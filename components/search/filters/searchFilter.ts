import type { IDocumentQuery } from 'ravendb'
import { BaseModel } from '@nodevault/platform.components.common'

export interface ISearchFilter {
  negate: boolean
  name: string
  terms: string[]
  operator: 'AND' | 'OR'
  matches: (term: string) => boolean
  apply: (query: IDocumentQuery<BaseModel>) => IDocumentQuery<BaseModel>
}
