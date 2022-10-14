import {
	AuthResponse,
	CreateMediaDto,
	CreateMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	SignInDto,
} from '@nx-next-nest/types';
import { User } from '@prisma/client';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { validateJWT } from '../utils';

import userReducer from './user';

export const mainApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3333/api',
		prepareHeaders: (headers) => {
			const jwt = validateJWT();
			if (jwt.valid) {
				headers.set('Authorization', `Bearer ${jwt.jwt}`);
			}
			return headers;
		},
	}),
	tagTypes: ['Media'],
	endpoints: (builder) => ({
		login: builder.mutation<AuthResponse, SignInDto>({
			query: (dto) => ({
				url: '/auth/signin',
				method: 'POST',
				body: dto,
			}),
		}),
		user: builder.query<User, void>({
			query: () => '/user/me',
		}),
		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
			query: (dto) => ({
				url: '/media',
				params: dto,
			}),
			providesTags: ['Media'],
		}),
		addMedia: builder.mutation<CreateMediaResponse, CreateMediaDto>({
			query: (dto) => ({
				url: '/media',
				method: 'POST',
				body: dto,
			}),
			invalidatesTags: ['Media'],
		}),
	}),
});

export const {
	useLoginMutation,
	useUserQuery,
	useGetMediaQuery,
	useAddMediaMutation,
} = mainApi;

export const store = configureStore({
	reducer: {
		[mainApi.reducerPath]: mainApi.reducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(mainApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
