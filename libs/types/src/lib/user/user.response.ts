import { Image } from '@prisma/client';

export type SignInResponse = {
	accessToken: string;
};

export type GetAllUsersResponse = {
	id: number;
	image: {
		image: Image;
	};
	alias: string;
}[];
