import { CreateWaifuDto, EditWaifuDto } from '@nx-next-nest/types';
import { Prisma } from '@prisma/client';

export const upsertWaifuImage = (
	dto: EditWaifuDto
): Prisma.WaifuUpdateInput['image'] | undefined => {
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

export const createWaifuImage = (dto: CreateWaifuDto) => {
	const { imageFormat } = dto;
	if (typeof imageFormat === 'string') {
		return {
			create: {
				image: {
					create: {
						format: imageFormat,
					},
				},
			},
		};
	}
};
