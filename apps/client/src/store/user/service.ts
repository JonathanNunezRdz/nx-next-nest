import { SignInDto, SignInResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { validateJWT } from '../../utils';

export const userApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3333/api',
		prepareHeaders: (headers, { getState }) => {
			const jwt = validateJWT();
			if (jwt.valid) {
				headers.set('Authorization', `Bearer ${jwt.jwt}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		login: builder.mutation<SignInResponse, SignInDto>({
			query: (dto) => ({
				url: '/auth/signin',
				method: 'POST',
				body: dto,
			}),
		}),
		user: builder.query<User, void>({
			query: () => '/user/me',
		}),
	}),
});

export const { useLoginMutation, useUserQuery } = userApi;
