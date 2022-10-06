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

const editMedia = (dto: EditMediaDto) => api.patch('/media', dto);

const getEditMedia = (mediaId: number) =>
	api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);

const knownMedia = (dto: KnowMediaDto) =>
	api.patch<KnowMediaResponse>('/media/know', dto);

const getMedias = (dto: GetMediaDto) =>
	api.get<GetMediaResponse>('/media', {
		params: {
			...dto,
		},
	});

const addMedia = (dto: CreateMediaDto) =>
	api.post<CreateMediaResponse>('/media/create', dto);

const mediaService = {
	getMedias,
	addMedia,
	knownMedia,
	getEditMedia,
	editMedia,
};

export default mediaService;
