import type { QueryStatistics, Lazy, Facet, FacetResultObject } from 'ravendb'
import { getValueByPath } from '@nodevault/platform.components.utils'
import { fakeLazy, isPromise } from '@nodevault/platform.components.utils.server'
import type { BaseModel } from '@nodevault/platform.components.domain'
import type { SearchContext } from './entities.js'

const applyAggregations = (searchContext: SearchContext): Lazy<FacetResultObject> => {
  let aggregationQuery = searchContext.facetQuery.aggregateBy(searchContext.facets[0])

  searchContext.facets.slice(1).forEach((f) => {
    aggregationQuery = aggregationQuery.andAggregateBy(f)
  })

  return aggregationQuery.executeLazy()
}

const applyActiveFacetAggregation = (searchContext: SearchContext): Lazy<FacetResultObject> | null => {
  if (!searchContext.activeFilter) return null

  const filterName = searchContext.activeFilter.name
  const facetToApply = searchContext.facets.find(f => (<Facet>f).fieldName === filterName)

  return facetToApply ? searchContext.facetQueryActive.aggregateBy(facetToApply).executeLazy() : null
}

export const execute = async (searchContext: SearchContext): Promise<SearchContext> => {
  // configure statistics and get the lazy results
  let stats: QueryStatistics | null = null

  if (searchContext.includes && searchContext.docs) {
    Object.keys(searchContext.includes).forEach((key) => {
      searchContext.query = searchContext.query.include(searchContext.includes[key])
    })
  }

  if (searchContext.selectFields?.length && searchContext.docs) {
    searchContext.query = searchContext.query.selectFields(searchContext.selectFields)
  }

  const lazyResults = searchContext.docs ? searchContext.query.statistics(s => (stats = s)).lazily() : fakeLazy([])
  const lazyAggregationResults = searchContext.docsOnly || !searchContext.facets?.length ? null : applyAggregations(searchContext)
  const lazyActiveFacetAggregationResults = searchContext.docsOnly || !searchContext.facets?.length ? null : applyActiveFacetAggregation(searchContext)

  // materialise the results, this sends all 3 queries to the server in one request
  const results = (await lazyResults.getValue()) as BaseModel[]

  searchContext.facetResults = lazyAggregationResults
    ? await lazyAggregationResults.getValue()
    : (null as unknown as FacetResultObject)
  searchContext.facetQueryActiveResults = lazyActiveFacetAggregationResults
    ? await lazyActiveFacetAggregationResults.getValue()
    : (null as unknown as FacetResultObject)
  searchContext.results!.setStats(stats ?? undefined, searchContext.settings)

  // map any includes, this needs to happen before we call the resultMap below
  if (searchContext.includes && searchContext.docs && searchContext.applyIncludes) {
    for (const result of results) {
      for (const key of Object.keys(searchContext.includes)) {
        const id = getValueByPath(result, searchContext.includes[key])

        ;(result as Record<string, any>)[key] = await searchContext.session.get(id)
      }
    }
  }

  const mapResults = async () => {
    if (searchContext.resultsMapAll) {
      return isPromise(searchContext.resultsMapAll)
        ? await searchContext.resultsMapAll(results)
        : searchContext.resultsMapAll(results)
    }

    if (searchContext.resultsMap) return results.map((r: BaseModel) => searchContext.resultsMap(r))

    return []
  }

  searchContext.results!.docs = searchContext.docs ? await mapResults() : []

  return searchContext
}
