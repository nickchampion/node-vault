/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StandardResponseSchema = {
	status: string;
	message: string;
	stack?: string;
	code?: string;
	body?: any;
	validation?: Array<{
		path?: string;
		message?: string;
		code?: string;
		data?: any;
	}>;
};

