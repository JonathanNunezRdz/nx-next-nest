import { ImageFormat, MediaType, Waifu, WaifuImage } from '@prisma/client';
import { RequestStatus } from '../common';
import { EditWaifuDto } from './edit-waifu.dto';
import { GetAllWaifusDto } from './get-all-waifus.dto';

export * from './create-waifu.dto';
export * from './edit-waifu.dto';
export * from './get-all-waifus.dto';
export * from './get-media-waifu.dto';

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

export interface WaifuState {
	get: {
		data: WaifuResponse[];
		totalWaifus: number;
		appliedFilters: GetAllWaifusDto;
	} & RequestStatus;
	add: RequestStatus;
	edit: {
		data: EditWaifuDto;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
}
