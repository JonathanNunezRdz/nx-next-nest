import { SignInResponse } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import api from '../api';

const getUser = () => api.get<User>('/user/me');

const signIn = (email: string, password: string) =>
	api.post<SignInResponse>('/auth/signin', { email, password });

const userService = {
	signIn,
	getUser,
};

export default userService;
