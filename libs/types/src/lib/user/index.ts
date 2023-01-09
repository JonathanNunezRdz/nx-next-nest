import { Image, User } from '@prisma/client';
import { RequestStatus } from '../common';

export * from './edit-user.dto';
export * from './signin.dto';
export * from './signup.dto';

export interface UserState {
	user: {
		data: User;
	} & RequestStatus;
	auth: {
		isLoggedIn: boolean;
		checkedJWT: boolean;
	};
	signIn: RequestStatus;
	signOut: RequestStatus;
	members: {
		data: GetAllUsersResponse;
	} & RequestStatus;
}

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
