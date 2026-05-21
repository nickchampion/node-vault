/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RegisterRequestSchema = {
	firstName: string;
	lastName: string;
	email: string;
	phone?: {
		countryCode: string;
		number: string;
	} | null;
};

