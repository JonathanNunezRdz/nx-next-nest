import {
	CreateMediaDto,
	CreateMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@nx-next-nest/types';
import api from '../api';

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
};

export default mediaService;
