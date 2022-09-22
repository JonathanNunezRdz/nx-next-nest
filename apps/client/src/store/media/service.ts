import { GetMediaDto, GetMediaResponse } from '@nx-next-nest/types';
import api from '../api';

export const getMedias = (dto: GetMediaDto) => {
	return api.get<GetMediaResponse[]>('/media', {
		params: {
			...dto,
		},
	});
};

const mediaService = {
	getMedias,
};

export default mediaService;
