import { JWTPayload, JWTStatus } from '@nx-next-nest/types';
import { ImageFormat, MediaType, WaifuLevel } from '@prisma/client';
import { ImageFormats, MediaTypes, WaifuLevelLabels } from './constants';

export function invalidateJWT() {
	localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY!);
}

export function validateJWT(): JWTStatus {
	const jwt = localStorage.getItem(
		process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY!
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
}

export function setJWT(jwt: string) {
	localStorage.setItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY!, jwt);
}

export function formatDate(dateString?: string) {
	const date = dateString ? new Date(dateString) : new Date();

	const month =
		date.getMonth() + 1 < 10
			? `0${date.getMonth() + 1}`
			: `${date.getMonth() + 1}`;

	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const parsed = `${date.getFullYear()}-${month}-${day}`;

	return parsed;
}

export function prepareDate(dateString: string) {
	return new Date(`${dateString}T00:00:00`).toISOString();
}

export function parseMediaId(mediaId: string | string[]) {
	if (typeof mediaId === 'object' || typeof mediaId === 'undefined')
		return -1;
	try {
		const id = parseInt(mediaId, 10);
		return id;
	} catch (error) {
		return -1;
	}
}

export function parseWaifuId(waifuId: string | string[]) {
	if (typeof waifuId === 'object' || typeof waifuId === 'undefined')
		return -1;
	try {
		const id = parseInt(waifuId, 10);
		return id;
	} catch (error) {
		return -1;
	}
}

export function loadImage(images: FileList) {
	return new Promise<{ result: string; format: ImageFormat; image: File }>(
		(resolve, reject) => {
			if (images && images[0]) {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (event.target) {
						const format = images[0].type.split('/').pop();
						if (isValidImageFormat(format!)) {
							resolve({
								result: event.target.result as string,
								format,
								image: images[0],
							});
						}
					}
				};
				reader.readAsDataURL(images[0]);
			} else reject('not a valid format');
		}
	);
}

export function isValidImageFormat(format: string): format is ImageFormat {
	return ImageFormats.includes(format);
}

export function isValidMediaType(mediaType: string): mediaType is MediaType {
	return MediaTypes.includes(mediaType);
}

export function isValidWaifuLevel(level: string): level is WaifuLevel {
	return Object.keys(WaifuLevelLabels).includes(level);
}
