import { SignInResponse } from '@nx-next-nest/types';
import api from '../api';

const signIn = (email: string, password: string) =>
	api.post<SignInResponse>('/auth/signin', { email, password });

const userService = {
	signIn,
};

export default userService;
