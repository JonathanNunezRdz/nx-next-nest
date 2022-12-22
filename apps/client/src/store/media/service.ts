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
} from '@nx-next-nest/types';
import qs from 'qs';

import api from '../api';

// TODO: fix all routes which have an array in params

const getMediaWaifus = (title: string, dto: GetMediaWaifusDto) =>
	api.get<GetMediaWaifusResponse>(`/waifu/${title}`, { params: dto });

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
			console.log(
				qs.stringify(params, { encode: false, arrayFormat: 'comma' })
			);

			return qs.stringify(params, {
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
};

export default mediaService;
