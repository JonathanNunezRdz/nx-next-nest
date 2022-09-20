import type { EditUserDto } from '@nx-next-nest/types';
import type { Prisma } from '@prisma/client';

export const upsertUserImage = (
	dto: EditUserDto
): Prisma.UserUpdateInput['image'] | undefined => {
	const { imageFormat } = dto;
	if (typeof imageFormat === 'string') {
		return {
			upsert: {
				create: {
					image: {
						create: {
							format: imageFormat,
						},
					},
				},
				update: {
					image: {
						update: {
							format: imageFormat,
						},
					},
				},
			},
		};
	}
	return undefined;
};
