import axios, { AxiosError } from 'axios';
import api from '../api';

export interface SignInError {
	error: string;
	message: string | string[];
	statusCode: number;
}

export function isAxiosError<ResponseType>(
	error: unknown
): error is AxiosError<ResponseType> {
	return axios.isAxiosError(error);
}

export const signIn = async (email: string, password: string) => {
	const {
		data: { accessToken },
	} = await api.post<{ accessToken: string }>('/auth/signin', {
		email,
		password,
	});
	api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};
