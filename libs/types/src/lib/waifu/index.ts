import { RequestStatus } from '../common';
import { EditWaifuDto } from './edit-waifu.dto';
import { GetAllWaifusDto } from './get-all-waifus.dto';
import { WaifuResponse } from './waifu.response';

export * from './create-waifu.dto';
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
		data: EditWaifuDto;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
}
