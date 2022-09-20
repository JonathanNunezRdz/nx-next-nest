import {
	Image,
	ImageFormat,
	KnownMedia,
	Media,
	MediaImage,
	User,
	UserImage,
} from '@prisma/client';

// TODO: complete GetMediaResponseType from prisma client
1;
export type GetMediaResponseType = Media & {
	image: MediaImage & {
		format: ImageFormat;
	};
	knownBy: KnownMedia & {
		user: Pick<User, 'id' | 'alias'> & {
			image: UserImage & {
				image: Pick<Image, 'id' | 'format'>;
			};
		};
	};
};
