import { GetMediaDto, GetMediaResponse } from '@nx-next-nest/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3333/api' }),
	endpoints: (builder) => ({
		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
			query: (dto) => ({
				url: '/media',
				params: dto,
			}),
		}),
	}),
});

export const { useGetMediaQuery } = apiSlice;
