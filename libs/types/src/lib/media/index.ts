import { KnownMedia, Media, MediaType, User } from '@prisma/client';

import { MyImage, RequestStatus } from '../common';
import { GetMediaDto } from './get-media.dto';
import {
	GetEditMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusResponse,
	MediaResponse,
} from './media.response';

export * from './create-media.dto';
export * from './delete-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';
export * from './media.response';

export type MediaKnownUser = KnownMedia & {
	user: Pick<User, 'id' | 'alias'> & {
		image?: MyImage;
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
		data: GetEditMediaResponse;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	delete: {
		mediaId: Media['id'];
	} & RequestStatus;
	titles: {
		data: GetMediaTitlesResponse;
	} & RequestStatus;
	mediaWaifus: {
		id: Media['id'];
		data: GetMediaWaifusResponse;
	} & RequestStatus;
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}
