import { Theme } from '@chakra-ui/react';
import { HttpError, JWTPayload, JWTStatus } from '@nx-next-nest/types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export * from './constants';

export const isHttpError = (data: unknown): data is HttpError => {
	return typeof data === 'object' && data != null && 'statusCode' in data;
};

export const isFetchBaseQueryError = (
	error: unknown
): error is FetchBaseQueryError => {
	return typeof error === 'object' && error != null && 'status' in error;
};

export const isErrorWithMessage = (
	error: unknown
): error is { message: string } => {
	return (
		typeof error === 'object' &&
		error != null &&
		'message' in error &&
		typeof (error as any).message === 'string'
	);
};

export const invalidateJWT = () => {
	localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY);
};

export const validateJWT = (): JWTStatus => {
	const jwt = localStorage.getItem(
		process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY
	);

	if (jwt !== null) {
		const payloadString = Buffer.from(
			jwt.split('.')[1],
			'base64'
		).toString();
		const { exp } = JSON.parse(payloadString) as JWTPayload;

		if (exp * 1000 > Date.now())
			return {
				jwt,
				valid: true,
			};

		invalidateJWT();
		return { valid: false };
	}
	invalidateJWT();
	return { valid: false };
};

export const setJWT = (jwt: string) => {
	localStorage.setItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY, jwt);
};

export const formatDate = (dateString?: string) => {
	const date = dateString ? new Date(dateString) : new Date();

	const month =
		date.getMonth() + 1 < 10
			? `0${date.getMonth() + 1}`
			: `${date.getMonth() + 1}`;

	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const parsed = `${date.getFullYear()}-${month}-${day}`;

	return parsed;
};

export const prepareDate = (dateString: string) => {
	return new Date(`${dateString}T00:00:00`).toISOString();
};

export const useMediaId = (mediaId: string | string[]) => {
	if (typeof mediaId === 'object' || typeof mediaId === 'undefined')
		return -1;
	try {
		const id = parseInt(mediaId);
		return id;
	} catch (error) {
		return -1;
	}
};

export const getCardBg = (
	isFetching: boolean,
	level: keyof Theme['colors']['blue'],
	baseColor: keyof Theme['colors']
) => {
	if (isFetching) {
		const newLevel = () => {
			if (level === 50) return level + 150;
			if (level === 900) return level;
			return level + 200;
		};
		return `${baseColor}.${newLevel()}`;
	}
	return `${baseColor}.${level}`;
};
