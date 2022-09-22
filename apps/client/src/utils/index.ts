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
