import {
	CreateWaifuResponse,
	CreateWaifuThunk,
	EditWaifuResponse,
	EditWaifuThunk,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetEditWaifuResponse,
} from '@nx-next-nest/types';
import { Waifu } from '@prisma/client';
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

function getEditWaifu(waifuId: Waifu['id']) {
	return api.get<GetEditWaifuResponse>(`waifu/edit/${waifuId}`);
}

// post services

function addWaifu(dto: CreateWaifuThunk) {
	const { waifuDto, imageFile } = dto;

	const formData = new FormData();
	for (const [key, value] of Object.entries(waifuDto)) {
		formData.append(key, value);
	}
	if (imageFile) formData.append('file', imageFile);
	return api.post<CreateWaifuResponse>('/waifu', formData);
}

// patch services

function editWaifu(dto: EditWaifuThunk) {
	return api.patch<EditWaifuResponse>('/waifu', dto);
}

// delete services

const waifuService = {
	editWaifu,
	getAllWaifus,
	addWaifu,
	getEditWaifu,
};

export default waifuService;
