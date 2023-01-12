import { ImageFormat, Media, MediaImage } from '@prisma/client';

import { MediaKnownUser } from '.';
import { EditMediaDto } from './edit-media.dto';

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
	totalMedias: number;
};

export type MediaResponse = Media & {
	waifus: {
		id: number;
		name: string;
	}[];
	image:
		| (MediaImage & {
				image: {
					format: ImageFormat;
					src?: string | undefined;
				};
		  })
		| null;
	knownBy: MediaKnownUser[];
};
