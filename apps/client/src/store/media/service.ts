// import {
// 	CreateMediaDto,
// 	CreateMediaResponse,
// 	GetMediaDto,
// 	GetMediaResponse,
// } from '@nx-next-nest/types';
// import { mainApi } from '..';

// // import api from '../api';

// // const editMedia = (dto: EditMediaDto) => api.patch('/media', dto);

// // const getEditMedia = (mediaId: number) =>
// // 	api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);

// // const knownMedia = (dto: KnowMediaDto) =>
// // 	api.patch<KnowMediaResponse>('/media/know', dto);

// // const getMedias = (dto: GetMediaDto) =>
// // 	api.get<GetMediaResponse>('/media', {
// // 		params: {
// // 			...dto,
// // 		},
// // 	});

// // const addMedia = (dto: CreateMediaDto) =>
// // 	api.post<CreateMediaResponse>('/media/create', dto);

// // const mediaService = {
// // 	getMedias,
// // 	addMedia,
// // 	knownMedia,
// // 	getEditMedia,
// // 	editMedia,
// // };

// // export default mediaService;

// export const mediaApi = mainApi.injectEndpoints({
// 	endpoints: (builder) => ({
// 		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
// 			query: (dto) => ({
// 				url: '/media',
// 				params: dto,
// 			}),
// 		}),
// 		addMedia: builder.mutation<CreateMediaResponse, CreateMediaDto>({
// 			query: (dto) => ({
// 				url: '/media',
// 				method: 'POST',
// 				body: dto,
// 			}),
// 		}),
// 	}),
// 	overrideExisting: false,
// });

// export const { useGetMediaQuery, useAddMediaMutation } = mediaApi;

export {};
