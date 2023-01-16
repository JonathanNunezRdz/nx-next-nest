import {
	GetAllUsersResponse,
	GetUserResponse,
	HttpError,
	SignInDto,
	SignInResponse,
	UserState,
} from '@nx-next-nest/types';
import type { User } from '@prisma/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '..';
import { invalidateJWT, setJWT, validateJWT } from '../../utils';
import api from '../api';
import userService from './service';

// get actions

export const getUser = createAsyncThunk<
	GetUserResponse,
	void,
	{ rejectValue: HttpError }
>('user/getUser', async (_, thunkApi) => {
	try {
		const { data } = await userService.getUser();
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response!.data);
		}
		throw error;
	}
});

export const getAllUsers = createAsyncThunk<
	GetAllUsersResponse,
	void,
	{ rejectValue: HttpError }
>('user/getAll', async (_, thunkApi) => {
	try {
		const { data } = await userService.getAllUsers();
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response!.data);
		}
		throw error;
	}
});

// post actions

export const signIn = createAsyncThunk<
	SignInResponse,
	SignInDto,
	{ rejectValue: HttpError }
>('user/signIn', async ({ email, password }, thunkApi) => {
	try {
		const { data } = await userService.signIn(email, password);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response!.data);
		}
		throw error;
	}
});

// patch actions

// delete actions

const initialState: UserState = {
	user: {
		data: {} as UserState['user']['data'],
		status: 'idle',
		error: undefined,
	},
	auth: {
		isLoggedIn: false,
		checkedJWT: false,
	},
	signIn: {
		status: 'idle',
		error: undefined,
	},
	signOut: {
		status: 'idle',
		error: undefined,
	},
	members: {
		data: [],
		status: 'idle',
		error: undefined,
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		getLoggedStatus: (state) => {
			const status = validateJWT();
			if (status.valid) {
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${status.jwt}`;

				state.signIn.status = 'succeeded';
				state.auth.isLoggedIn = true;
			} else {
				api.defaults.headers.common['Authorization'] = '';

				state.signIn.status = 'idle';
				state.auth.isLoggedIn = false;
			}
			state.auth.checkedJWT = true;
		},
		signOut: (state) => {
			invalidateJWT();
			api.defaults.headers.common['Authorization'] = '';

			state.user.data = {} as UserState['user']['data'];
			state.user.status = 'idle';
			state.user.error = undefined;
			state.auth.isLoggedIn = false;
			state.signIn.status = 'idle';
			state.signIn.error = undefined;
			state.signOut.status = 'succeeded';
			state.signOut.error = undefined;
			state.members.data = [];
			state.members.status = 'idle';
			state.members.error = undefined;
		},
		resetSignInStatus: (state) => {
			state.signIn.status = 'idle';
			state.signIn.error = undefined;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(signIn.pending, (state) => {
				state.signIn.status = 'loading';
			})
			.addCase(signIn.fulfilled, (state, action) => {
				setJWT(action.payload.accessToken);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${action.payload.accessToken}`;
				state.signIn.status = 'succeeded';
				state.signIn.error = undefined;
				state.auth.isLoggedIn = true;
			})
			.addCase(signIn.rejected, (state, action) => {
				invalidateJWT();
				state.signIn.status = 'failed';
				state.signIn.error = action.payload;
				state.user.data = {} as User;
			})
			.addCase(getUser.pending, (state) => {
				state.user.status = 'loading';
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.user = {
					data: action.payload,
					status: 'succeeded',
					error: undefined,
				};
			})
			.addCase(getUser.rejected, (state, action) => {
				state.user.data = {} as User;
				state.user.status = 'failed';
				state.user.error = action.payload;
				if (action.payload?.statusCode === 412) invalidateJWT();
			})
			.addCase(getAllUsers.pending, (state) => {
				state.members.status = 'loading';
			})
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.members.data = action.payload;
				state.members.status = 'succeeded';
				state.members.error = undefined;
			})
			.addCase(getAllUsers.rejected, (state, action) => {
				state.members.status = 'failed';
				state.members.error = action.payload;
			});
	},
});

const userReducer = userSlice.reducer;

export const { signOut, getLoggedStatus, resetSignInStatus } =
	userSlice.actions;

export const selectSignInStatus = (state: RootState) => state.user.signIn;

export const selectUserStatus = (state: RootState) => ({
	status: state.user.user.status,
	error: state.user.user.error,
});

export const selectAuth = (state: RootState) => state.user.auth;

export const selectUser = (state: RootState) => state.user.user.data;

export const selectAllUsers = (state: RootState) => state.user.members.data;
export const selectAllUsersStatus = (state: RootState) => ({
	status: state.user.members.status,
	error: state.user.members.error,
});

export default userReducer;
