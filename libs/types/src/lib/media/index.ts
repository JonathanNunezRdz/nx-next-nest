import { Image, KnownMedia, MediaType, User, UserImage } from '@prisma/client';

import { RequestStatus } from '../common';
import { WaifuResponse } from '../waifu';
import { CreateMediaDto } from './create-media.dto';
import { EditMediaDto } from './edit-media.dto';
import { GetMediaDto } from './get-media.dto';
import { GetMediaTitlesResponse, MediaResponse } from './media.response';

export * from './create-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';
export * from './media.response';

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
		totalMedias: number;
		appliedFilters: GetMediaDto;
	} & RequestStatus;
	add: RequestStatus;
	know: RequestStatus;
	edit: {
		data: EditMediaDto;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	delete: RequestStatus;
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

export interface CreateMediaWithoutImage {
	media: CreateMediaDto;
	withImage: false;
}

export interface CreateMediaWithImage {
	media: CreateMediaDto;
	withImage: true;
	image: File;
	path: string;
}

export type CreateMedia = CreateMediaWithImage | CreateMediaWithoutImage;
