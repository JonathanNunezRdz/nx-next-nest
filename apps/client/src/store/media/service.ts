import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@nx-next-nest/types';

import api from '../api';

export const editMedia = (dto: EditMediaDto) => api.patch('/media', dto);

export const getEditMedia = (mediaId: number) =>
	api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);

export const knownMedia = (dto: KnowMediaDto) =>
	api.patch<KnowMediaResponse>('/media/know', dto);

export const getMedias = (dto: GetMediaDto) =>
	api.get<GetMediaResponse>('/media', {
		params: {
			...dto,
		},
	});

export const addMedia = (dto: CreateMediaDto) =>
	api.post<CreateMediaResponse>('/media/create', dto);

const mediaService = {
	getMedias,
	addMedia,
	knownMedia,
	getEditMedia,
	editMedia,
};

export default mediaService;
