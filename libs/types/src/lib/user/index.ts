import { User } from '@prisma/client';

import { RequestStatus } from '../common';
import { GetAllUsersResponse } from './user.response';

export * from './edit-user.dto';
export * from './signin.dto';
export * from './signup.dto';
export * from './user.response';

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
