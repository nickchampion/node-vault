import { SearchContext } from './entities.js'
import { StandardFilter } from './filters/index.js'
import { StatefulQuerystring } from './querystring.js'
import { last } from 'rambda'

export const querystring = (searchContext: SearchContext): SearchContext => {
  // use stateful querystring to make modifications to the querystring before we
  // start generating facet links and clear links
  const statefulQuery = new StatefulQuerystring(searchContext.event.pathAndQuery)

  // update offset as this should always be 0 for new queries
  statefulQuery.addOrReplace('offset', '0')

  // now convert the StatefulQuerystring into a StatelessQuerystring which does not update its state when performing operations
  // this is so each facet only appends or removes relevant parts of the URL for its url field
  searchContext.querystring = statefulQuery.toStateless()
  return searchContext
}

/**
 * Parse the incoming URL to extract sort and paging info
 * @param context
 * @returns
 */
export const parseQuery = (searchContext: SearchContext): SearchContext => {
  searchContext.settings = searchContext.event.getQuerySettings(undefined, true)
  return searchContext
}

/**
 * Extract any facet filters from the query and create standard filters for each
 * @param searchContext
 * @returns
 */
export const parseFacets = (searchContext: SearchContext) => {
  searchContext.facetFilters = Object.keys(searchContext.event.query)
    .filter(k => k.startsWith('f:') && searchContext.event.query[k])
    .map(key => {
      return new StandardFilter(
        key.replace('f:', ''),
        searchContext.event.query[key].toString().split(','),
        searchContext.useAndOperator.includes(key) ? 'AND' : 'OR'
      )
    })
  searchContext.activeFilter = last(searchContext.facetFilters)
  return searchContext
}
