import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	KnowMediaDto,
	KnowMediaResponse,
	PostImageDto,
} from '@nx-next-nest/types';
import { stringify } from 'qs';

import api from '../api';

// TODO: fix all routes which have an array in params

const postMediaImage = (dto: PostImageDto, file: File) => {
	const formData = new FormData();
	formData.append('filename', dto.filename);
	formData.append('file', file);
	formData.append('format', dto.format);
	return api.post<string>('/media/test_image', formData);
};

const deleteMedia = (mediaId: number | string) =>
	api.delete<void>(`/media/${mediaId}`);

const getMediaWaifus = (title: string, dto: GetMediaWaifusDto) =>
	api.get<GetMediaWaifusResponse>(`/waifu/${title}`, {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});

const getMediaTitles = () => api.get<GetMediaTitlesResponse>('/media/titles');

const editMedia = (dto: EditMediaDto) => api.patch('/media', dto);

const getEditMedia = (mediaId: number) =>
	api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);

const knownMedia = (dto: KnowMediaDto) =>
	api.patch<KnowMediaResponse>('/media/know', dto);

const getMedias = (dto: GetMediaDto) =>
	api.get<GetMediaResponse>('/media', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});

const addMedia = (dto: CreateMediaDto) =>
	api.post<CreateMediaResponse>('/media/create', dto);

const mediaService = {
	getMediaWaifus,
	getMedias,
	addMedia,
	knownMedia,
	getEditMedia,
	editMedia,
	getMediaTitles,
	deleteMedia,
	postMediaImage,
};

export default mediaService;
