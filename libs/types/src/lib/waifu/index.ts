import { ImageFormat, MediaType, Waifu, WaifuImage } from '@prisma/client';

export * from './create-waifu.dto';
export * from './edit-waifu.dto';
export * from './get-all-waifus.dto';
export * from './get-media-waifu.dto';

export type EditWaifuResponse = WaifuResponse;

export type GetMediaWaifusResponse = WaifuResponse[];

export type CreateWaifuResponse = WaifuResponse;

export type GetAllWaifusResponse = {
	waifus: WaifuResponse[];
	totalPages: number;
};

export type WaifuResponse = Waifu & {
	image: WaifuImage & {
		image: {
			format: ImageFormat;
		};
	};
	user: {
		alias: string;
	};
	media: {
		title: string;
		type: MediaType;
	};
};
