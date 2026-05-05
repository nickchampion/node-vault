import { last, groupBy, titleCaseFirst, trimEnd } from '@nodevault/platform.components.utils'
import type { FacetResult, FacetValue } from 'ravendb'
import type {
  SearchContext, FacetMap, Facet, IAggregation, FacetTerm, FacetTermAggregation,
} from './entities.js'
import { StatelessQuerystring } from './querystring.js'
import type { ISearchFilter } from './filters/index.js'

/**
 * When we filter by a facet term i.e. commodity:grain the commodity facet will only return grain in the facet query results
 * in order to allow end users to choose multiple terms from each filter we need to run an additional query to get
 * the terms for the active filter without the active filter being applied to the query so we get all the terms available
 * this function is combining the terms from the active facet query results with the main facet results to facilitate this
 * @param searchContext
 * @returns
 */
export const mapActiveFacet = (searchContext: SearchContext): SearchContext => {
  if (!searchContext.facetQueryActiveResults || searchContext.docsOnly) return searchContext

  const activeFacet = mapFacets(searchContext, Object.values(searchContext.facetQueryActiveResults))[0]
  const activeIndex = searchContext.results.facets.findIndex(f => f.name === activeFacet.name)

  searchContext.results.facets[activeIndex] = activeFacet

  return searchContext
}

/**
 * Map RavenDB facets to our API facet representation, constructing the url for each facet and term
 * @param searchContext
 * @returns
 */
export const facets = (searchContext: SearchContext): SearchContext => {
  if (searchContext.docsOnly) return searchContext

  mapAggregations(searchContext)

  searchContext.results.clearUrl = new StatelessQuerystring(searchContext.querystring.removeAllFacets()).replace('offset', '0')
  searchContext.results.facets = searchContext.facetResults
    ? mapFacets(searchContext, Object.values(searchContext.facetResults))
    : []

  return searchContext
}

/**
 * Maps a set of filters that have been applied and a link to remove them from the query
 * @param searchContext
 * @returns
 */
export const activeFilters = (searchContext: SearchContext): SearchContext => {
  if (searchContext.docsOnly) return searchContext

  searchContext.results.activeFilters = searchContext.results.facets
    .filter(f => f.selected)
    .map(f => ({
      name: f.name,
      clearUrl: f.clearUrl,
      displayName: f.displayName,
      terms: f.terms
        .filter(t => t.selected)
        .map(t => ({
          name: t.name,
          clearUrl: t.url,
          id: t.id,
          hits: t.hits,
        })),
    }))

  return searchContext
}

export const mapCustomFacets = (searchContext: SearchContext) => {
  if (searchContext.docsOnly) return searchContext

  searchContext.customFacets.forEach((f) => {
    const activeFacet = searchContext.querystring.isLastElement(f.name)
    const disabled = !activeFacet

    const facet: Facet = {
      displayName: titleCaseFirst(f?.displayName ?? f.name),
      clearUrl: searchContext.querystring.remove([f.name], true),
      disabled: disabled,
      name: f.name,
      selected: searchContext.querystring.contains(f.name),
      active: activeFacet,
      terms: Object.keys(f.terms ?? {}).map((key) => {
        const selected = searchContext.event.query[f.name] && searchContext.event.query[f.name] === key

        return {
          name: f.terms![key],
          hits: searchContext.results.totalDocs,
          selected,
          id: key,
          state: selected && disabled ? 'checked disabled' : selected ? 'checked' : disabled ? 'disabled' : '',
          url: getFacetTermUrl(f.name, key, selected, searchContext.querystring),
          replaceUrl: searchContext.querystring.addOrReplace(f.name, key, true),
        }
      }),
    }

    searchContext.results.facets.push(facet)
  })

  return searchContext
}

const mapFacets = (searchContext: SearchContext, results: FacetResult[]) => {
  // the active facet is the last facet / filter in the URL and is the filter currently being modified by the user
  const activeFacet = last(searchContext.facetFilters)

  return results
    .filter(fr => fr.name !== '@AllResults')
    .map((f) => {
      const filter = searchContext.facetFilters.find(ff => ff.name.toLowerCase() === f.name.toLowerCase())
      const disabled = !!(activeFacet && activeFacet.name !== f.name && filter != null)
      const facetName = `f:${f.name}`
      const facetMap = searchContext.facetMaps[f.name] ?? null

      const facet: Facet = {
        displayName: titleCaseFirst(facetMap?.displayName ?? f.name),
        clearUrl: searchContext.querystring.remove([facetName], true),
        disabled: disabled,
        name: facetName,
        selected: searchContext.querystring.contains(facetName),
        active: !!(activeFacet && activeFacet.name === f.name),
        terms: mapTerms(searchContext, f, facetMap, filter, disabled, facetName),
      }

      return facet
    })
}

const mapTerms = (
  searchContext: SearchContext,
  facetResult: FacetResult,
  facetMap: FacetMap,
  filter: ISearchFilter | undefined,
  disabled: boolean,
  facetName: string,
): FacetTerm[] => {
  const ranges = groupBy(facetResult.values, 'range') as Record<string, FacetValue[]>

  return (
    Object.keys(ranges)
      .filter(v => v !== 'NULL_VALUE')
      .map((range) => {
        const base = ranges[range][0]
        const selected = filter ? filter.matches(base.range) : false
        const id = findFacetId(facetMap, base.range)

        return <FacetTerm>{
          name: findFacetTerm(facetMap, base.range),
          hits: base.count,
          selected,
          id,
          state: selected && disabled ? 'checked disabled' : selected ? 'checked' : disabled ? 'disabled' : '',
          url: getFacetTermUrl(facetName, id, selected, searchContext.querystring),
          replaceUrl: searchContext.querystring.addOrReplace(facetName, id, true),
          aggregations: mapTermAggregations(ranges[range]),
        }
      })
      // support filters in the map to exclude terms as needed
      .filter(t => (facetMap && facetMap.filter ? facetMap.filter(t.name, t.id) : true))
  )
}

const mapTermAggregations = (facetValues: FacetValue[]): Record<string, FacetTermAggregation> | undefined => {
  if (facetValues.length === 1 && !facetValues[0].name) return undefined

  const aggregations: Record<string, FacetTermAggregation> = {}

  facetValues.forEach((fv) => {
    aggregations[fv.name] = {
      sum: fv.sum,
      average: fv.average,
      min: fv.min,
      max: fv.max,
    }
  })
  return aggregations
}

const mapAggregations = (searchContext: SearchContext): void => {
  const facetResult = searchContext.facetResults && searchContext.facetResults['@AllResults']

  if (!facetResult) return

  const aggregations: IAggregation[] = facetResult.values.map((v: FacetValue) => ({
    unit: '',
    name: v.name,
    sum: v.sum,
    hits: v.count,
    min: v.min,
    max: v.max,
    average: v.average,
  }))

  searchContext.results.aggregations = searchContext.results.aggregations.concat(aggregations)
}

const findFacetId = (map: FacetMap, termId: string) => {
  return map && map.map ? map.map(termId) : termId
}

const findFacetTerm = (map: FacetMap, termId: string) => {
  if (!map) return termId

  const term = map.map ? map.map(termId).toLowerCase() : termId

  return map.terms && map.terms[term] ? map.terms[term] : map.termMap ? map.termMap(term) : term
}

const getFacetTermUrl = (facetName: string, termId: string, selected: boolean, querystring: StatelessQuerystring) => {
  const urlFacet = querystring.get(facetName)

  // if the facet does not exist in the url just return url with this facet term appended
  if (!urlFacet) return querystring.addOrReplace(facetName, termId, true)

  let urlFacetTerms = urlFacet.split(',')

  if (selected) urlFacetTerms = urlFacetTerms.filter(t => t !== termId)
  else urlFacetTerms.push(termId)

  // generate the new querystring value for this facet
  const newTerms = urlFacetTerms.reduce((current, t) => {
    current += `${t},`
    return current
  }, '')

  return newTerms === ''
    ? querystring.remove([facetName], true)
    : querystring.addOrReplace(facetName, trimEnd(newTerms, ','), true)
}
