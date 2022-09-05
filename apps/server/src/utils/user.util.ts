import type { Prisma } from '@prisma/client';
import type { EditUserDto } from '../app/user/dto';

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
