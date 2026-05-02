import { BaseModel } from '@nodevault/platform.components.common'
import { SearchContext } from '../entities.js'
import type { IDocumentQuery } from 'ravendb'
import { invariantCultureCompare } from '@nodevault/platform.components.utils'

/**
 * Apply any facet and other filters to the query, note we are building
 * up 2 queries as we need one for the documents and one for the facets
 * @param searchContext
 * @returns
 */
export const applyFilters = (searchContext: SearchContext): SearchContext => {
  const apply = (query: IDocumentQuery<BaseModel>, isActiveFacet: boolean, isCustomFacet = false): IDocumentQuery<BaseModel> => {
    searchContext.facetFilters.forEach(f => {
      // only apply the facet if there is no active facet (facet currently being filtered by end user)
      // isActiveFacet is false or there is an active facet and we are fitlering the facetQueryActive
      // query and the current filter is NOT the active filter
      const shouldApply =
        !isActiveFacet ||
        !searchContext.activeFilter ||
        (searchContext.activeFilter && isActiveFacet && searchContext.activeFilter.name !== f.name)

      if (shouldApply) {
        if (!isCustomFacet || !invariantCultureCompare(f.name, searchContext.customFacetName)) {
          query = f.apply(query)
        }
      }
    })

    if (searchContext.search && searchContext.search.length > 0) {
      query = query.search(
        'query',
        searchContext.search
          .split(' ')
          .map(t => `*${t}*`) // use wildcards to match partial words
          .join(' '),
        'AND'
      )
    }

    return query
  }

  searchContext.query = apply(searchContext.query, false)
  searchContext.facetQuery = apply(searchContext.facetQuery, false)
  searchContext.facetQueryActive = apply(searchContext.facetQueryActive, true)

  if (searchContext.customFacetQuery) {
    searchContext.customFacetQuery = apply(searchContext.customFacetQuery, false, true)
  }

  return searchContext
}

/**
 * Apply sorting and paging settings to the document query, facet queries dont need these applied
 * @param searchContext
 * @returns
 */
export const applySettings = (searchContext: SearchContext): SearchContext => {
  for (const sort of searchContext.settings.sortBy) {
    const sortOrderType = searchContext.sortOrderTypeMap[sort.fieldName]

    searchContext.query = sort.sortDesc
      ? sortOrderType
        ? searchContext.query.orderByDescending(sort.fieldName, sortOrderType)
        : searchContext.query.orderByDescending(sort.fieldName)
      : sortOrderType
        ? searchContext.query.orderBy(sort.fieldName, sortOrderType)
        : searchContext.query.orderBy(sort.fieldName)
  }

  searchContext.query = searchContext.query.take(searchContext.settings.limit).skip(searchContext.settings.offset)
  return searchContext
}
