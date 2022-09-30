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
import { EditMediaDto } from './edit-media.dto';

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

export interface MediaState {
	get: {
		data: GetMediaResponse;
	} & RequestStatus;
	add: RequestStatus;
	know: RequestStatus;
	edit: {
		local: {
			data: EditMediaDto;
		} & RequestStatus;
		server: {
			data: EditMediaDto;
		} & RequestStatus;
	};
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}
