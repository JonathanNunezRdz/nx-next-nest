import { Media, MediaType, User, Waifu } from '@prisma/client';
import { MyImage } from '../common';

export type EditWaifuResponse = WaifuResponse;

export type GetEditWaifuResponse = RawWaifu & {
	image?: MyImage;
};

export type CreateWaifuResponse = WaifuResponse;

export type GetAllWaifusResponse = {
	waifus: WaifuResponse[];
	totalWaifus: number;
};

export type WaifuResponse = Waifu & {
	user: {
		alias: User['alias'];
	};
	media: {
		title: Media['title'];
		type: Media['type'];
	};
	image?: MyImage;
};

export type RawWaifu = Omit<Waifu, 'createdAt' | 'updatedAt' | 'since'>;

export type GetMediaWaifusResponse = {
	waifus: WaifuResponse[];
	type: MediaType;
};
