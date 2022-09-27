import { JWTPayload, JWTStatus } from '@nx-next-nest/types';

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
