import { SignUpDto } from '../app/auth/dto';

export const createUserImage = (dto: SignUpDto) => {
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
