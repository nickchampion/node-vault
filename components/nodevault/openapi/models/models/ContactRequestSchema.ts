/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ContactRequestSchema = {
	name: string;
	email: string;
	interests: Array<'grapheneos' | 'umbrelos' | 'business' | 'other'>;
	message: string;
	phone?: {
		countryCode: string;
		number: string;
	} | null;
};

