import { SearchContext } from './entities.js'
import { QueryStatistics, Lazy, type FacetResultObject, Facet } from 'ravendb'
import { getValueByPath, fakeLazy, isPromise } from '@nodevault/platform.components.utils'
import { BaseModel } from '@nodevault/platform.components.common'
import { utils } from '@nodevault/platform.components.ravendb'

const applyAggregations = (searchContext: SearchContext): Lazy<FacetResultObject> => {
  let aggregationQuery = searchContext.facetQuery.aggregateBy(searchContext.facets[0])

  searchContext.facets.slice(1).forEach(f => {
    aggregationQuery = aggregationQuery.andAggregateBy(f)
  })

  return aggregationQuery.executeLazy()
}

const applyActiveFacetAggregation = (searchContext: SearchContext): Lazy<FacetResultObject> => {
  if (!searchContext.activeFilter) return null

  const facetToApply = searchContext.facets.find(f => (<Facet>f).fieldName === searchContext.activeFilter.name)

  return facetToApply ? searchContext.facetQueryActive.aggregateBy(facetToApply).executeLazy() : null
}

const applyCustomFacetAggregation = (searchContext: SearchContext): Lazy<FacetResultObject> => {
  if (!searchContext.customFacetQuery || !searchContext.customFacetBuilder) return null

  return searchContext.customFacetQuery.aggregateBy(utils.buildFacet(searchContext.customFacetBuilder)).executeLazy()
}

export const execute = async (searchContext: SearchContext): Promise<SearchContext> => {
  // configure statistics and get the lazy results
  let stats: QueryStatistics = null

  if (searchContext.includes && searchContext.docs) {
    Object.keys(searchContext.includes).forEach(key => {
      searchContext.query = searchContext.query.include(searchContext.includes[key])
    })
  }

  // append the query we've executed to any logs for this request
  searchContext.log.capture('query', searchContext.query.toString())
  searchContext.log.capture(
    'parameters',
    searchContext.query['_queryParameters'] ? JSON.stringify(searchContext.query['_queryParameters']) : null
  )

  if (searchContext.selectFields?.length && searchContext.docs) {
    searchContext.query = searchContext.query.selectFields(searchContext.selectFields)
  }

  const lazyResults = searchContext.docs ? searchContext.query.statistics(s => (stats = s)).lazily() : fakeLazy([])
  const lazyAggregationResults = searchContext.docsOnly || !searchContext.facets?.length ? null : applyAggregations(searchContext)
  const lazyActiveFacetAggregationResults =
    searchContext.docsOnly || !searchContext.facets?.length ? null : applyActiveFacetAggregation(searchContext)
  const lazyCustomFacetAggregationResults =
    searchContext.docsOnly || !searchContext.facets?.length || !searchContext.customFacetQuery
      ? null
      : applyCustomFacetAggregation(searchContext)

  // materialise the results, this sends all 3 queries to the server in one request
  const results = (await lazyResults.getValue()) as BaseModel[]

  searchContext.facetResults = lazyAggregationResults ? await lazyAggregationResults.getValue() : null
  searchContext.facetQueryActiveResults = lazyActiveFacetAggregationResults
    ? await lazyActiveFacetAggregationResults.getValue()
    : null
  searchContext.results.setStats(stats, searchContext.settings)

  if (lazyCustomFacetAggregationResults) {
    searchContext.customFacetResultMap(searchContext, await lazyCustomFacetAggregationResults.getValue())
  }

  // map any includes, this needs to happen before we call the resultMap below
  if (searchContext.includes && searchContext.docs && searchContext.applyIncludes) {
    for (const result of results) {
      for (const key of Object.keys(searchContext.includes)) {
        const id = getValueByPath(result, searchContext.includes[key])
        result[key] = await searchContext.session.get(id)
      }
    }
  }

  const mapResults = async () => {
    if (searchContext.resultsMapFlat) {
      return results.flatMap((r: BaseModel) => searchContext.resultsMap(r))
    }

    if (searchContext.resultsMapAll) {
      return isPromise(searchContext.resultsMapAll)
        ? await searchContext.resultsMapAll(results)
        : searchContext.resultsMapAll(results)
    }

    if (searchContext.resultsMap) return results.map((r: BaseModel) => searchContext.resultsMap(r))

    return []
  }

  searchContext.results.docs = searchContext.docs ? await mapResults() : []

  return searchContext
}
