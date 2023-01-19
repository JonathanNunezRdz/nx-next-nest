import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	EditWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
} from '@nx-next-nest/types';
import { stringify } from 'qs';

import api from '../api';

// get services

function getAllWaifus(dto: GetAllWaifusDto) {
	return api.get<GetAllWaifusResponse>('/waifu', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

// post services

function addWaifu(dto: CreateWaifuDto) {
	return api.post<CreateWaifuResponse>('/waifu', dto);
}

// patch services

function editWaifu(dto: EditWaifuDto) {
	return api.patch<EditWaifuResponse>('/waifu', dto);
}

// delete services

const waifuService = {
	editWaifu,
	getAllWaifus,
	addWaifu,
};

export default waifuService;
