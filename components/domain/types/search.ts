export class Page<T> {
  docs: T[]
  totalDocs: number
  limit?: number
  offset?: number

  constructor() {
    this.docs = []
    this.totalDocs = 0
    this.limit = 25
    this.offset = 0
  }
}

export class QuerySettingsSortBy {
  fieldName: string | undefined
  sortDesc: boolean | undefined

  constructor(fields: Partial<QuerySettingsSortBy>) {
    Object.assign(this, fields)
  }
}

export class QuerySettings {
  limit?: number = 25
  offset?: number = 0
  sortBy?: QuerySettingsSortBy[] = [new QuerySettingsSortBy({ fieldName: 'createdAtUTC', sortDesc: false })]
  sortDesc?: boolean = false
  filters?: Record<string, string | string[]> = {}
  count?: boolean = false
  startDateISO: string | null = null
  endDateISO: string | null = null

  constructor(fields: Partial<QuerySettings>) {
    Object.assign(this, fields)
  }

  shouldApplyFilters = () => {
    return this.filters?.length || this.startDateISO || this.endDateISO
  }
}
