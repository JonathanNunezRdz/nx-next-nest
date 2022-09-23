import {
	CreateMediaDto,
	GetMediaDto,
	GetMediaResponse,
	PostMediaResponse,
} from '@nx-next-nest/types';
import api from '../api';

export const getMedias = (dto: GetMediaDto) =>
	api.get<GetMediaResponse>('/media', {
		params: {
			...dto,
		},
	});

export const addMedia = (dto: CreateMediaDto) =>
	api.post<PostMediaResponse>('/media/create', dto);

const mediaService = {
	getMedias,
	addMedia,
};

export default mediaService;
