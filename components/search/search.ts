import type { Context } from '@nodevault/platform.components.context'
import type { BaseModel } from '@nodevault/platform.components.common'
import { HectareError, collections, Errors } from '@nodevault/platform.components.common'
import type { FacetBuilder, type IDocumentQuery, FacetBase, type FacetResultObject } from 'ravendb'
import { clone, isNumericString, mergeInTo, toObject } from '@nodevault/platform.components.utils'
import type { FacetMap, type RawQuery, SearchContext, SearchResults, type SortOrderType } from './entities.js'
import * as url from './url.js'
import * as map from './map.js'
import * as filters from './filters/index.js'
import { execute as search } from './execute.js'

const pipe = <T>(value: T, ...fns: Array<(input: any) => any>): any => fns.reduce((acc, fn) => fn(acc), value as any)

/**
 * The search component allows us to perform faceted searches for any collection.
 */
export class Search<T extends BaseModel, TResult, TCustom = any> {
  searchContext: SearchContext

  constructor(model: new () => T) {
    this.searchContext = new SearchContext(new model().getIndexName())
    this.searchContext.results = new SearchResults<TResult, TCustom>()
    return this
  }

  async execute(): Promise<SearchResults<TResult, TCustom>> {
    this.validate(true)

    // Run the following functions in order from top to bottom passing the output of the
    // current function as the args to the next and so on until we have our results ready
    const sc = pipe(
      this.searchContext,
      // extract any facet filters from the URL
      url.parseFacets,
      // extract sort / paging info from URL
      url.parseQuery,
      // apply the facet filters to the query
      filters.applyFilters,
      // apply paging and sort settings to the query
      filters.applySettings,
      // initialise the querystring helper which is used for generating links for the search results
      url.querystring,
    )

    const res = await search(sc)

    const r = pipe(
      res,
      // map results, we need andThen as search is async, andThen handles awaiting on
      // the promise before invoking the next function, map.facets in this instance
      map.facets,
      // if we have an active facet combine the terms from this query with the facet terms from the main facet query results
      map.mapCustomFacets,
      // map active filters to the results
      map.mapActiveFacet,
      // map the active filters to the results
      map.activeFilters,
    )

    return r.results as SearchResults<TResult, TCustom>
  }

  /**
   * Instead of executing the query just build it, generally used for exporting
   * @returns
   */
  build(): IDocumentQuery<T> {
    this.validate(false)

    const sc = pipe(
      this.searchContext,
      // extract any facet filters from the URL
      url.parseFacets,
      // extract sort / paging info from URL
      url.parseQuery,
      // apply the facet filters to the query
      filters.applyFilters,
      // apply paging and sort settings to the query
      filters.applySettings,
      // initialise the querystring helper which is used for generating links for the search results
      url.querystring,
    )

    return sc.query as IDocumentQuery<T>
  }

  /**
   * Set up the query using information from the context and clone the event for use in building the queries
   * @param context
   * @returns
   */
  withContext(context: Context) {
    if (!context.session.database) throw new HectareError(Errors.Format(Errors.Platform.SessionNotInitialised))

    const database = context.session.database

    this.searchContext.session = context.session
    this.searchContext.docs = !context.event.query.docs || context.event.query.docs === 'true'
    this.searchContext.log = context.log
    this.searchContext.event = context.event
    this.searchContext.query = database.query<T>({
      indexName: this.searchContext.index,
    })
    this.searchContext.facetQuery = database.query<T>({
      indexName: this.searchContext.index,
    })
    this.searchContext.facetQueryActive = database.query<T>({
      indexName: this.searchContext.index,
    })
    return this
  }

  withCustomFacetQuery(
    context: Context,
    customFacetName: string,
    facetBuilder: (facetBuilder: FacetBuilder<BaseModel>) => void,
    resultMap: (ctx: SearchContext, facetResult: FacetResultObject) => void,
  ) {
    if (!context.session.database) throw new HectareError(Errors.Format(Errors.Platform.SessionNotInitialised))

    this.searchContext.customFacetName = customFacetName
    this.searchContext.customFacetResultMap = resultMap
    this.searchContext.customFacetBuilder = facetBuilder
    this.searchContext.customFacetQuery = context.session.database.query<T>({
      indexName: this.searchContext.index,
    })
    return this
  }

  withProjection(fields: string[]) {
    this.searchContext.selectFields = fields
    return this
  }

  withAndOperator(fields: string[]) {
    this.searchContext.useAndOperator = fields
    return this
  }

  /**
   * Sets up the index name to use when performing the search query.
   * @param index
   * @returns
   */
  withIndex(context: Context, index: string) {
    if (!context.session.database) throw new HectareError(Errors.Format(Errors.Platform.SessionNotInitialised))

    const database = context.session.database

    this.searchContext.index = index

    this.searchContext.query = database.query<T>({
      indexName: this.searchContext.index,
    })
    this.searchContext.facetQuery = database.query<T>({
      indexName: this.searchContext.index,
    })
    this.searchContext.facetQueryActive = database.query<T>({
      indexName: this.searchContext.index,
    })

    if (this.searchContext.customFacetQuery) {
      this.searchContext.customFacetQuery = database.query<T>({
        indexName: this.searchContext.index,
      })
    }

    return this
  }

  /**
   * Ensure results are filtered by organisation
   * @param organisationId
   * @returns
   */
  withOrganisationId(organisationId: string, fieldName: string = 'organisationId') {
    if (!this.searchContext.query) throw new HectareError(Errors.Format(Errors.Platform.SearchFieldNotSet, 'context'))

    const apply = (q: IDocumentQuery<BaseModel>) => {
      return q.whereEquals(fieldName, collections.organisations.id(organisationId))
    }

    this.searchContext.query = apply(this.searchContext.query)
    this.searchContext.facetQuery = apply(this.searchContext.facetQuery)
    this.searchContext.facetQueryActive = apply(this.searchContext.facetQueryActive)

    if (this.searchContext.customFacetQuery) {
      this.searchContext.customFacetQuery = apply(this.searchContext.customFacetQuery)
    }

    return this
  }

  withConditional(cond: () => boolean, action: (search: Search<T, TResult, TCustom>) => Search<T, TResult, TCustom>) {
    if (cond()) {
      action(this)
    }

    return this
  }

  /**
   * Ensure results are filtered by organisation
   * @param organisationId
   * @param excludeFromCustomQuery if true fn should not be applied to the customFacetQuery
   * @returns
   */
  withQueryAugmentation(fn: (q: IDocumentQuery<BaseModel>) => IDocumentQuery<BaseModel>, excludeFromCustomQuery?: boolean) {
    if (!this.searchContext.query) throw new HectareError(Errors.Format(Errors.Platform.SearchFieldNotSet, 'context'))

    this.searchContext.query = fn(this.searchContext.query)
    this.searchContext.facetQuery = fn(this.searchContext.facetQuery)
    this.searchContext.facetQueryActive = fn(this.searchContext.facetQueryActive)

    if (this.searchContext.customFacetQuery && !excludeFromCustomQuery) {
      this.searchContext.customFacetQuery = fn(this.searchContext.customFacetQuery)
    }

    return this
  }

  /**
   * Allows us to include referenced documents from another collection in the results without additinoal DB round trips
   * @param includes
   * @returns
   */
  withIncludes(includes: Record<string, string>, apply = true) {
    this.searchContext.includes = includes
    this.searchContext.applyIncludes = apply
    return this
  }

  /**
   * Dont perform faceted search
   * @param includes
   * @returns
   */
  withDocsOnly(docsOnly: boolean) {
    this.searchContext.docsOnly = docsOnly
    return this
  }

  /**
   * Set of facets to apply to the aggregation query
   * @param facets
   * @returns
   */
  withFacets(facets: FacetBase[]) {
    this.searchContext.facets = clone(facets)
    return this
  }

  /**
   * A custom facet thats not an actual facet returned from the db query
   * @param facet
   * @returns
   */
  withCustomFacet(facet: FacetMap) {
    if (facet) this.searchContext.customFacets.push(facet)

    return this
  }

  /**
   * Ability to control how we sort fields (numeric, string, etc)
   * @param mappings
   * @returns
   */
  withSortOrderTypeMappings(mappings: Record<string, SortOrderType>) {
    this.searchContext.sortOrderTypeMap = mappings ?? {}
    return this
  }

  /**
   * Optional set of maps for each facet to map the terms to a human
   * readable expression, i.e. turn commodity Ids into commodity names
   * @param facetMaps
   * @returns
   */
  withFacetMaps(facetMaps: FacetMap[]) {
    this.searchContext.facetMaps = toObject(facetMaps, m => m.name, false)
    return this
  }

  /**
   * Map to convert the docs in the results to the structure returned by the API
   * @param map
   * @returns
   */
  withResultsMap(map: (model: T) => TResult | TResult[]) {
    this.searchContext.resultsMap = map as (model: BaseModel) => any
    return this
  }

  /**
   * Map to convert the docs in the results to the structure returned by the API, this map handles all at once
   * @param map
   * @returns
   */
  withResultsMapAll(map: (model: T[]) => Promise<TResult[]> | TResult[]) {
    this.searchContext.resultsMapAll = map as (model: BaseModel[]) => Promise<any[]> | any[]
    return this
  }

  withResultsMapFlat() {
    this.searchContext.resultsMapFlat = true
    return this
  }

  withFreeTextQuery(query: string) {
    if (query && query.length > 0) this.searchContext.search = query

    return this
  }

  withModification(action: (search: Search<T, TResult, TCustom>) => Search<T, TResult, TCustom>) {
    return action(this)
  }

  buildRawQuery = (): RawQuery => {
    this.searchContext = url.parseQuery(url.parseFacets(this.searchContext))

    const mapArray = (t: string | string[]) => {
      const terms = Array.isArray(t) ? t : [t]

      if (terms.some(t => !isNumericString(t))) {
        return terms.map(x => `'${x}'`).join(',')
      } else {
        return terms.join(',')
      }
    }

    const settingsFilters = this.searchContext.settings.filters ?? {}
    const whereFilters = this.searchContext.facetFilters
      .map(f => `${f.name} in (${mapArray(f.terms)})`)
      .concat(
        Object.keys(settingsFilters).map(k => `${k} in (${mapArray(settingsFilters[k])})`),
      )

    let sort = `order by createdAtUTC ${this.searchContext.settings.sortDesc ? 'desc' : ''}`

    if (this.searchContext.settings.sortBy?.length) {
      sort = `order by ${this.searchContext.settings.sortBy.map((sort) => {
        const fieldName = sort.fieldName ?? ''
        const as = this.searchContext.sortOrderTypeMap[fieldName]
          ? `as ${this.searchContext.sortOrderTypeMap[fieldName]}`
          : ''

        return `${fieldName} ${as} ${sort.sortDesc ? 'desc' : ''}`
      })}`
    }

    const rawQuery: RawQuery = {
      filters: mergeInTo(
        toObject(
          this.searchContext.facetFilters,
          f => f.name,
          false,
          f => f.terms,
        ),
        settingsFilters,
      ),
      where: whereFilters.join(' and '),
      sort,
    }

    return rawQuery
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(facets: boolean) {
    if (!this.searchContext.event) throw new HectareError(Errors.Format(Errors.Platform.SearchFieldNotSet, 'event'))
    // if (!this.searchContext.facets && facets) throw new HectareError(Errors.Format(Errors.Platform.SearchFieldNotSet, 'facets'))
  }
}
