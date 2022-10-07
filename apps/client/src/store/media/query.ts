import { GetMediaDto, GetMediaResponse } from '@nx-next-nest/types';
import { emptySlice } from '..';

export const mediaSlice = emptySlice.injectEndpoints({
	endpoints: (builder) => ({
		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
			query: (dto) => ({
				url: '/media',
				params: dto,
			}),
		}),
	}),
	overrideExisting: false,
});

export const { useGetMediaQuery } = mediaSlice;
