import { CreateWaifuDto } from '@nx-next-nest/types';

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
