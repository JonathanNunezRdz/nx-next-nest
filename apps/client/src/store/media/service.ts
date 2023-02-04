import {
	CreateMediaResponse,
	CreateMediaThunk,
	EditMediaResponse,
	EditMediaThunk,
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
import { Media } from '@prisma/client';
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

function getEditMedia(mediaId: Media['id']) {
	return api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);
}

// post services

function addMedia(dto: CreateMediaThunk) {
	const { mediaDto, imageFile } = dto;

	const formData = new FormData();
	for (const key of Object.keys(mediaDto)) {
		formData.append(key, mediaDto[key]);
	}

	if (imageFile) formData.append('file', imageFile);

	return api.post<CreateMediaResponse>('/media', formData);
}

// patch services

function knownMedia(dto: KnowMediaDto) {
	return api.patch<KnowMediaResponse>('/media/know', dto);
}

function editMedia(dto: EditMediaThunk) {
	const { editDto, imageFile } = dto;

	const formData = new FormData();
	for (const key of Object.keys(editDto)) {
		formData.append(key, editDto['key']);
	}

	if (imageFile) formData.append('file', imageFile);

	return api.patch<EditMediaResponse>('/media', formData);
}

// delete services

function deleteMedia(mediaId: number | string) {
	return api.delete<void>(`/media/${mediaId}`);
}

function postMediaImage(dto: PostImageDto, file: File) {
	const formData = new FormData();
	formData.append('filename', dto.filename);
	formData.append('file', file);
	formData.append('format', dto.format);
	return api.post<string>('/media/test_image', formData);
}

function getMediaWaifus(title: string, dto: GetMediaWaifusDto) {
	return api.get<GetMediaWaifusResponse>(`/waifu/${title}`, {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

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
