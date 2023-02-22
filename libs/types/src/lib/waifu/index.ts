import { Waifu } from '@prisma/client';
import { RequestStatus } from '../common';
import { GetAllWaifusDto } from './get-all-waifus.dto';
import { GetEditWaifuResponse, WaifuResponse } from './waifu.response';

export * from './create-waifu.dto';
export * from './delete-waifu.dto';
export * from './edit-waifu.dto';
export * from './get-all-waifus.dto';
export * from './get-media-waifu.dto';
export * from './waifu.response';

export interface WaifuState {
	get: {
		data: WaifuResponse[];
		totalWaifus: number;
		appliedFilters: GetAllWaifusDto;
	} & RequestStatus;
	add: RequestStatus;
	edit: {
		data: GetEditWaifuResponse;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	delete: {
		waifuId: Waifu['id'];
	} & RequestStatus;
}
