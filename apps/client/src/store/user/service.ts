// import { AuthResponse, SignInDto } from '@nx-next-nest/types';
// import { User } from '@prisma/client';

// import { mainApi } from '..';

// export const userApi = mainApi.injectEndpoints({
// 	endpoints: (builder) => ({
// 		login: builder.mutation<AuthResponse, SignInDto>({
// 			query: (dto) => ({
// 				url: '/auth/signin',
// 				method: 'POST',
// 				body: dto,
// 			}),
// 		}),
// 		user: builder.query<User, void>({
// 			query: () => '/user/me',
// 		}),
// 	}),
// 	overrideExisting: false,
// });

// export const { useLoginMutation, useUserQuery } = userApi;

export {};
