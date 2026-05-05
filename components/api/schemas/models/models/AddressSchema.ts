/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AddressSchema = {
	name?: string | null;
	line1: string;
	line2?: string | null;
	line3?: string | null;
	city?: string | null;
	region?: string | null;
	regionISO?: string | null;
	postcode: string;
	countryName?: string | null;
	countryISO: string;
	coordinates?: {
		lat: number;
		lon: number;
	} | null;
};

