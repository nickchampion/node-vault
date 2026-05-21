/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserSearchResultsSchema = {
	docs: Array<{
		id: string;
		email: string;
		lastName: string;
		firstName: string;
		accountId: string;
		countryISO: string;
		phone: {
			countryCode: string;
			number: string;
		} | null;
		roles: Array<'guest' | 'user' | 'admin'>;
	}>;
	custom?: any;
	/**
	 * Total number of documents matching your query
	 */
	totalDocs: number;
	/**
	 * Number of results to show per page
	 */
	limit: number;
	/**
	 * Number of records to skip before get a page of records
	 */
	offset: number;
	/**
	 * URL to remove all filters from the search
	 */
	clearUrl: string;
	/**
	 * Array of filters that have been applied to the query
	 */
	activeFilters: Array<{
		/**
		 * Name of the filter
		 */
		name: string;
		/**
		 * Name of the filter
		 */
		displayName: string;
		/**
		 * URL used to remove the filter from the query
		 */
		clearUrl: string;
		/**
		 * Array of terms that have been applied to this filter
		 */
		terms: Array<{
			/**
			 * Name of the term
			 */
			name: string;
			/**
			 * Unique id of the term used to apply the term filter to the query
			 */
			id: string;
			/**
			 * Number of documents that will be returned if you apply this facet term to the query
			 */
			hits: string;
			/**
			 * URL used to remove this term from the filter and the query
			 */
			clearUrl: string;
		}>;
	}>;
	/**
	 * Array of facets results that have been applied to the query, facilitated drilling into search results by terms of a given docoument field
	 */
	facets: Array<{
		/**
		 * User friendly name of the facet field
		 */
		displayName: string;
		/**
		 * URL used to remove this term from the facet and the query
		 */
		clearUrl: string;
		/**
		 * If true this facet has been applied to the query and cannot be edited except to use the clearUrl to remove this facet from the query
		 */
		disabled: boolean;
		/**
		 * Name of the facet, must match the facet name in the URL
		 */
		name: string;
		/**
		 * If true indicates this facet has been applied to the query
		 */
		selected: boolean;
		/**
		 * If true this is the active facet, the active facet is the facet a user is currently choosing terms from for the results. It behaves differently to other facets in that the API will return all terms for this facet as if we had not yet applied the facet to the query, this is to support multiple selection of terms for each facet
		 */
		active: boolean;
		/**
		 * Array of terms that are available to apply to the query for the given facet
		 */
		terms: Array<{
			/**
			 * Name of the term
			 */
			name: string;
			/**
			 * URL used to add (if this terms is not currently included in the query) or to remove (if the term is currently applied to the query) this term from the facet
			 */
			url: string;
			/**
			 * Number of documents that will be returned if you apply this facet term to the query
			 */
			hits: number;
			/**
			 * True if this facet term has been applied to the query
			 */
			selected: boolean;
			/**
			 * Unique id of the term used to apply the term filter to the query
			 */
			id: string;
			/**
			 * String representation of the current state of the term
			 */
			state: 'checked disabled' | 'checked' | 'disabled' | '';
			aggregations?: Record<string, {
				/**
				 * If the aggregation was "sum" this is the sum of this field across the results
				 */
				sum?: number;
				/**
				 * If the aggregation was "min" this is the lowest matching value of this field across the results
				 */
				min?: number;
				/**
				 * If the aggregation was "max" this is the highest matching value of this field across the results
				 */
				max?: number;
				/**
				 * If the aggregation was "average" this is the average of this field across the results
				 */
				average?: number;
			}>;
		}>;
	}>;
	/**
	 * Array of aggregations that have been applied to the query (sum of sold percentage across inventory records for example)
	 */
	aggregations?: Array<{
		/**
		 * Name of the field we have aggregated on
		 */
		name?: string;
		/**
		 * If the aggregation was "sum" this is the sum of this field across the results
		 */
		sum?: number;
		/**
		 * If the aggregation was "min" this is the lowest matching value of this field across the results
		 */
		min?: number;
		/**
		 * If the aggregation was "max" this is the highest matching value of this field across the results
		 */
		max?: number;
		/**
		 * If the aggregation was "average" this is the average of this field across the results
		 */
		average?: number;
		/**
		 * The number of documents used to calculate the aggregation
		 */
		count?: number;
		/**
		 * Used when we have a set of ranges we've aggregated on (Age range, price range etc)
		 */
		range?: string;
		/**
		 * The number of documents used to calculate the aggregation
		 */
		hits?: number;
		/**
		 * The measurement unit or currency of the aggregated value
		 */
		unit?: string;
	}>;
};

