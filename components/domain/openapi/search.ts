import type { OpenAPIV3 } from 'openapi-types'

export const ActiveFilters: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['name', 'displayName', 'clearUrl', 'terms'],
  properties: {
    name: {
      description: 'Name of the filter',
      type: 'string',
    },
    displayName: {
      description: 'Name of the filter',
      type: 'string',
    },
    clearUrl: {
      description: 'URL used to remove the filter from the query',
      type: 'string',
    },
    terms: {
      description: 'Array of terms that have been applied to this filter',
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'clearUrl', 'id', 'hits'],
        properties: {
          name: {
            description: 'Name of the term',
            type: 'string',
          },
          id: {
            description: 'Unique id of the term used to apply the term filter to the query',
            type: 'string',
          },
          hits: {
            description: 'Number of documents that will be returned if you apply this facet term to the query',
            type: 'string',
          },
          clearUrl: {
            description: 'URL used to remove this term from the filter and the query',
            type: 'string',
          },
        },
      },
    },
  },
}

export const Facets: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['displayName', 'clearUrl', 'disabled', 'name', 'selected', 'active', 'terms'],
  properties: {
    displayName: {
      description: 'User friendly name of the facet field',
      type: 'string',
    },
    clearUrl: {
      description: 'URL used to remove this term from the facet and the query',
      type: 'string',
    },
    disabled: {
      description:
        'If true this facet has been applied to the query and cannot be edited except to use the clearUrl to remove this facet from the query',
      type: 'boolean',
    },
    name: {
      description: 'Name of the facet, must match the facet name in the URL',
      type: 'string',
    },
    selected: {
      description: 'If true indicates this facet has been applied to the query',
      type: 'boolean',
    },
    active: {
      description:
        'If true this is the active facet, the active facet is the facet a user is currently choosing terms from for the results. It behaves differently to other facets in that the API will return all terms for this facet as if we had not yet applied the facet to the query, this is to support multiple selection of terms for each facet',
      type: 'boolean',
    },
    terms: {
      description: 'Array of terms that are available to apply to the query for the given facet',
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'url', 'hits', 'selected', 'id', 'state'],
        properties: {
          name: {
            description: 'Name of the term',
            type: 'string',
          },
          url: {
            description:
              'URL used to add (if this terms is not currently included in the query) or to remove (if the term is currently applied to the query) this term from the facet',
            type: 'string',
          },
          hits: {
            description: 'Number of documents that will be returned if you apply this facet term to the query',
            type: 'number',
          },
          selected: {
            description: 'True if this facet term has been applied to the query',
            type: 'boolean',
          },
          id: {
            description: 'Unique id of the term used to apply the term filter to the query',
            type: 'string',
          },
          state: {
            description: 'String representation of the current state of the term',
            type: 'string',
            enum: ['checked disabled', 'checked', 'disabled', ''],
          },
          aggregations: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                sum: {
                  description: 'If the aggregation was "sum" this is the sum of this field across the results',
                  type: 'number',
                },
                min: {
                  description: 'If the aggregation was "min" this is the lowest matching value of this field across the results',
                  type: 'number',
                },
                max: {
                  description: 'If the aggregation was "max" this is the highest matching value of this field across the results',
                  type: 'number',
                },
                average: {
                  description: 'If the aggregation was "average" this is the average of this field across the results',
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },
  },
}

export const Aggregations: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      description: 'Name of the field we have aggregated on',
      type: 'string',
    },
    sum: {
      description: 'If the aggregation was "sum" this is the sum of this field across the results',
      type: 'number',
    },
    min: {
      description: 'If the aggregation was "min" this is the lowest matching value of this field across the results',
      type: 'number',
    },
    max: {
      description: 'If the aggregation was "max" this is the highest matching value of this field across the results',
      type: 'number',
    },
    average: {
      description: 'If the aggregation was "average" this is the average of this field across the results',
      type: 'number',
    },
    count: {
      description: 'The number of documents used to calculate the aggregation',
      type: 'number',
    },
    range: {

      description: "Used when we have a set of ranges we've aggregated on (Age range, price range etc)",
      type: 'string',
    },
    hits: {
      description: 'The number of documents used to calculate the aggregation',
      type: 'number',
    },
    unit: {
      description: 'The measurement unit or currency of the aggregated value',
      type: 'string',
    },
  },
}

export const SearchResults = (docs?: OpenAPIV3.SchemaObject, custom?: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject => ({
  type: 'object',
  required: ['docs', 'totalDocs', 'limit', 'offset', 'clearUrl', 'activeFilters', 'facets'],
  properties: {
    docs: {
      type: 'array',
      items: docs || {
        type: 'object',
      },
    },
    custom: custom || { type: 'object' },
    totalDocs: {
      description: 'Total number of documents matching your query',
      type: 'number',
    },
    limit: {
      type: 'number',
      description: 'Number of results to show per page',
    },
    offset: {
      type: 'number',
      description: 'Number of records to skip before get a page of records',
    },
    clearUrl: {
      type: 'string',
      description: 'URL to remove all filters from the search',
    },
    activeFilters: {
      type: 'array',
      description: 'Array of filters that have been applied to the query',
      items: ActiveFilters,
    },
    facets: {
      type: 'array',
      description:
        'Array of facets results that have been applied to the query, facilitated drilling into search results by terms of a given docoument field',
      items: Facets,
    },
    aggregations: {
      type: 'array',
      description:
        'Array of aggregations that have been applied to the query (sum of sold percentage across inventory records for example)',
      items: Aggregations,
    },
  },
})
