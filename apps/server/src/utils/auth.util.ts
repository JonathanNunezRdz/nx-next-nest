import type { SignUpDto } from '@nx-next-nest/types';
import type { Prisma } from '@prisma/client';

export const createUserImage = (
	dto: SignUpDto
): Prisma.UserCreateInput['image'] => {
	if (typeof dto.imageFormat === 'string') {
		return {
			create: {
				image: {
					create: {
						format: dto.imageFormat,
					},
				},
			},
		};
	}
	return undefined;
};
