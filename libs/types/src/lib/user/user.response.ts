import { User } from '@prisma/client';

export type EditUserResponse = UserResponse;

export type SignInResponse = {
	accessToken: string;
};

export type GetUserResponse = UserResponse;

export type GetAllUsersResponse = UserResponse[];

export type UserResponse = Omit<User, 'image' | 'hash'> & {
	image?: {
		src: string;
	};
};
