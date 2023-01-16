import { Media, User, Waifu } from '@prisma/client';

export type EditWaifuResponse = WaifuResponse;

export type GetMediaWaifusResponse = WaifuResponse[];

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
	image?: {
		src: string;
	};
};
