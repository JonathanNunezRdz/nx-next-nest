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
import { WaifuResponse } from '../waifu';
import { EditMediaDto } from './edit-media.dto';

export * from './create-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';

export type GetMediaTitlesResponse = {
	id: number;
	title: string;
}[];

export type EditMediaResponse = MediaResponse;

export type GetEditMediaResponse = EditMediaDto;

export type KnowMediaResponse = MediaResponse;

export type CreateMediaResponse = MediaResponse;

export type GetMediaResponse = {
	medias: MediaResponse[];
	totalPages: number;
};

export type MediaResponse = Media & {
	image: MediaImage & {
		image: {
			format: ImageFormat;
		};
	};
	knownBy: MediaKnownUser[];
	waifus: {
		id: number;
		name: string;
	}[];
};

export type MediaKnownUser = KnownMedia & {
	user: Pick<User, 'id' | 'alias'> & {
		image: UserImage & {
			image: Pick<Image, 'id' | 'format'>;
		};
	};
};

export interface MediaState {
	get: {
		data: MediaResponse[];
		totalPages: number;
		currentPage: number;
	} & RequestStatus;
	add: RequestStatus;
	know: RequestStatus;
	edit: {
		data: EditMediaDto;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	titles: {
		data: GetMediaTitlesResponse;
	} & RequestStatus;
	mediaWaifus: {
		title: string;
		data: WaifuResponse[];
	} & RequestStatus;
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}
