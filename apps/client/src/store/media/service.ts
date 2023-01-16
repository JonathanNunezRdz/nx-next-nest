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

// TODO: change body from routes that send an image to FormData

// get servies

function getMedias(dto: GetMediaDto) {
	return api.get<GetMediaResponse>('/media', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

function getMediaTitles() {
	return api.get<GetMediaTitlesResponse>('/media/titles');
}

function getEditMedia(mediaId: number) {
	return api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);
}

// post services

function addMedia(dto: CreateMediaDto, image: File) {
	const formData = new FormData();
	for (const key of Object.keys(dto)) {
		formData.append(key, dto[key]);
	}
	formData.append('file', image);
	return api.post<CreateMediaResponse>('/media/create', formData);
}

// patch services

function knownMedia(dto: KnowMediaDto) {
	return api.patch<KnowMediaResponse>('/media/know', dto);
}

function editMedia(dto: EditMediaDto) {
	return api.patch('/media', dto);
}

// delete services

function deleteMedia(mediaId: number | string) {
	return api.delete<void>(`/media/${mediaId}`);
}

const postMediaImage = (dto: PostImageDto, file: File) => {
	const formData = new FormData();
	formData.append('filename', dto.filename);
	formData.append('file', file);
	formData.append('format', dto.format);
	return api.post<string>('/media/test_image', formData);
};

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
