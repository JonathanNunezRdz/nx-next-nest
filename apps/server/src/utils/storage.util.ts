import { ImageFormat } from '@prisma/client';

export const formatImageFileName = (name: string, format: ImageFormat) =>
	`${encodeURIComponent(name)}.${format}`;
