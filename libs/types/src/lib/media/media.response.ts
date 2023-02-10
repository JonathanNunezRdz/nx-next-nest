import { Media, Waifu } from '@prisma/client';

import { MediaKnownUser } from '.';
import { MyImage } from '../common';

export type GetMediaTitlesResponse = {
	id: Media['id'];
	title: Media['title'];
}[];

export type EditMediaResponse = MediaResponse;

export type GetEditMediaResponse = RawMedia & {
	knownAt: Date;
	image?: MyImage;
};

export type KnowMediaResponse = MediaResponse;

export type CreateMediaResponse = MediaResponse;

export type GetMediaResponse = {
	medias: MediaResponse[];
	totalMedias: number;
};

export type MediaResponse = Media & {
	waifus: Pick<Waifu, 'id' | 'name'>[];
	knownBy: MediaKnownUser[];
	image?: MyImage;
};

export type RawMedia = Omit<Media, 'createdAt' | 'updatedAt'>;
