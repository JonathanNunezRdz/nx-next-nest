import { Media, Waifu } from '@prisma/client';

import { MediaKnownUser } from '.';
import { EditMediaDto } from './edit-media.dto';

export type GetMediaTitlesResponse = {
	id: Media['id'];
	title: Media['title'];
}[];

export type EditMediaResponse = MediaResponse;

export type GetEditMediaResponse = EditMediaDto;

export type KnowMediaResponse = MediaResponse;

export type CreateMediaResponse = MediaResponse;

export type GetMediaResponse = {
	medias: MediaResponse[];
	totalMedias: number;
};

export type MediaResponse = Media & {
	waifus: Pick<Waifu, 'id' | 'name'>[];
	knownBy: MediaKnownUser[];
	image?: {
		src: string;
	};
};
