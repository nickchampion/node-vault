/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type VerifyLoginSchema = {
	tokens: {
		access: string;
		expiresAtUTC?: string;
	};
	user: {
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
	account: {
		id: string;
		name: string;
	};
};

