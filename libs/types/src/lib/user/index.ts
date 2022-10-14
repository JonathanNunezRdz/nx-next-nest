import { User } from '@prisma/client';

export * from './edit-user.dto';
export * from './signin.dto';
export * from './signup.dto';

export interface UserState {
	get: {
		data: User | null;
		checkedJWT: boolean;
	};
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}
