import axios, { AxiosError } from 'axios';
import api from '../api';

export interface GetMediaError {
	error: string;
	message: string | string[];
	statusCode: number;
}

export function isAxiosError<ResponseType>(
	error: unknown
): error is AxiosError<ResponseType> {
	return axios.isAxiosError(error);
}

export const getMedia = async (cursor: string, limit: number) => {
	const res = await api.get('/media', {
		params: {
			cursor,
			limit,
		},
	});
	console.log({ res });
};
