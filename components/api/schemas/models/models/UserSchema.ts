/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserSchema = {
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
};

