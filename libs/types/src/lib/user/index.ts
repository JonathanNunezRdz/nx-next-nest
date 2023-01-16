import { RequestStatus } from '../common';
import { GetAllUsersResponse, GetUserResponse } from './user.response';

export * from './edit-user.dto';
export * from './signin.dto';
export * from './signup.dto';
export * from './user.response';

export interface UserState {
	user: {
		data: GetUserResponse;
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
