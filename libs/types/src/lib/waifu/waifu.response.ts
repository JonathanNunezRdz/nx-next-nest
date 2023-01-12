import { ImageFormat, MediaType, Waifu, WaifuImage } from '@prisma/client';

export type EditWaifuResponse = WaifuResponse;

export type GetMediaWaifusResponse = WaifuResponse[];

export type CreateWaifuResponse = WaifuResponse;

export type GetAllWaifusResponse = {
	waifus: WaifuResponse[];
	totalWaifus: number;
};

export type WaifuResponse = Waifu & {
	image:
		| (WaifuImage & {
				image: {
					format: ImageFormat;
					src?: string | undefined;
				};
		  })
		| null;
	user: {
		alias: string;
	};
	media: {
		title: string;
		type: MediaType;
	};
};
