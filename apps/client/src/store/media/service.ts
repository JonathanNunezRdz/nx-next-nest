import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@nx-next-nest/types';

import api from '../api';

const getMediaTitles = () => api.get<GetMediaTitlesResponse>('/media/titles');

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
	getMediaTitles,
};

export default mediaService;
