import {
	Image,
	ImageFormat,
	KnownMedia,
	Media,
	MediaImage,
	User,
	UserImage,
} from '@prisma/client';
import { RequestStatus } from '../common';

export * from './create-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';

export type GetMediaResponse = Media & {
	image: MediaImage & {
		image: {
			format: ImageFormat;
		};
	};
	knownBy: (KnownMedia & {
		user: Pick<User, 'id' | 'alias'> & {
			image: UserImage & {
				image: Pick<Image, 'id' | 'format'>;
			};
		};
	})[];
};

export interface MediaState {
	media: {
		data: GetMediaResponse[];
	} & RequestStatus;
}
