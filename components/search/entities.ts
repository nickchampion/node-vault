import type { BaseModel } from '@nodevault/platform.components.domain'
import type { InboundEvent, QuerySettings } from '@nodevault/platform.components.context'
import { Page } from '@nodevault/platform.components.context'
import type { FacetBase, QueryStatistics, FacetBuilder, type IDocumentQuery, type FacetResultObject } from 'ravendb'
import type { Session } from '@nodevault/platform.components.ravendb'
import type { ISearchFilter } from './filters/index.js'
import type { StatelessQuerystring } from './querystring.js'

export type SortOrderType = 'AlphaNumeric' | 'Double' | 'Long' | 'String'

export class SearchContext {
  index: string
  docs: boolean = true
  docsOnly: boolean = false
  event!: InboundEvent
  query!: IDocumentQuery<BaseModel>
  customFacetQuery!: IDocumentQuery<BaseModel> // allow us to get aggregations of a facet excluding a specific filter
  customFacetName!: string
  customFacetBuilder!: (facetBuilder: FacetBuilder<BaseModel>) => void
  customFacetResultMap!: (ctx: SearchContext, facetResult: FacetResultObject) => void
  querystring!: StatelessQuerystring
  settings: QuerySettings = null as unknown as QuerySettings
  selectFields: string[] = []
  includes!: Record<string, string>
  applyIncludes: boolean = true
  useAndOperator: string[] = [] // list of fitlers that should use AND instead of OR
  activeFilter!: ISearchFilter | null
  log!: any
  session!: Session
  search!: string // free text search field
  results!: SearchResults<unknown, unknown>
  resultsMap!: (model: BaseModel) => any
  resultsMapAll!: (model: BaseModel[]) => Promise<any[]> | any[]
  resultsMapFlat: boolean = false
  customFacets: FacetMap[] = []
  facets!: FacetBase[]
  facetFilters: ISearchFilter[] = []
  facetMaps!: Record<string, FacetMap>
  facetResults: FacetResultObject = null as unknown as FacetResultObject
  facetQuery!: IDocumentQuery<BaseModel> // query used to get the facets
  // query used to get the active facet terms so they are not lost while choosing options from this filter
  facetQueryActive!: IDocumentQuery<BaseModel>
  facetQueryActiveResults: FacetResultObject = null as unknown as FacetResultObject
  sortOrderTypeMap: Record<string, SortOrderType> = {}

  constructor(index: string) {
    this.index = index
  }
}

export type RawQuery = {
  where: string
  sort: string
  filters: Record<string, string | string[]>
}

export class FacetMap {
  name!: string
  displayName!: string
  terms?: Record<string, string> | null = {}
  map?: (term: string) => string // maps ids if needed
  termMap?: (term: string) => string // maps terms if we need logic to map instead of a hash
  filter?: (term: string, id: string) => boolean // if set used to filter terms as needed
}

export interface IAggregation {
  name: string
  hits: number
  sum?: number
  min?: number
  max?: number
  average?: number
  unit: string
}

export class SearchResults<T, TCustom = any> extends Page<T> {
  facets!: Facet[]
  activeFilters!: ActiveFilter[]
  clearUrl!: string
  aggregations: IAggregation[]
  custom!: TCustom

  constructor() {
    super()
    this.aggregations = []
  }

  setStats(stats?: QueryStatistics, settings?: QuerySettings) {
    this.totalDocs = stats?.totalResults || 0
    this.limit = settings?.limit || 0
    this.offset = settings?.offset || 0
  }

  static empty() {
    return {
      docs: [],
      totalDocs: 0,
      limit: 0,
      offset: 0,
      facets: [],
      activeFilters: [],
      clearUrl: null,
      aggregations: [],
    }
  }
}

export type ActiveFilter = {
  name: string
  displayName: string
  clearUrl: string
  terms: SelectedFacetTerm[]
}

export type Facet = {
  name: string
  displayName: string
  selected: boolean
  active: boolean
  disabled: boolean
  clearUrl: string
  terms: FacetTerm[]
}

export type SelectedFacetTerm = {
  id: string
  name: string
  clearUrl: string
}

export type FacetTerm = {
  id: string
  name: string
  url: string
  replaceUrl: string
  selected: boolean
  hits: number
  state: string
  aggregations?: Record<string, FacetTermAggregation>
}

export type FacetTermAggregation = {
  sum?: number
  min?: number
  max?: number
  average?: number
}
