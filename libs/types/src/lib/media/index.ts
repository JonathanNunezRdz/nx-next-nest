import {
	Image,
	ImageFormat,
	KnownMedia,
	Media,
	MediaImage,
	MediaType,
	User,
	UserImage,
} from '@prisma/client';
import { RequestStatus } from '../common';

export * from './create-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';

export type KnowMediaResponse = MediaResponse;

export type CreateMediaResponse = MediaResponse;

export type GetMediaResponse = MediaResponse[];

export type MediaResponse = Media & {
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

export interface MediaState extends RequestStatus {
	data: GetMediaResponse;
	add: RequestStatus;
	know: RequestStatus;
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}
