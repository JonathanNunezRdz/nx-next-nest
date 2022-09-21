import {
	HttpError,
	SignInDto,
	SignInResponse,
	UserState,
} from '@nx-next-nest/types';
import type { User } from '@prisma/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import api from '../api';
import userService from './service';

export const getUser = createAsyncThunk<User, void, { rejectValue: HttpError }>(
	'user/getUser',
	async (_, thunkApi) => {
		try {
			const res = await userService.getUser();
			return res.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const { response } = error as AxiosError<HttpError>;
				return thunkApi.rejectWithValue(response.data);
			}
			throw error;
		}
	}
);

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
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

const initialState: UserState = {
	user: {
		status: 'idle',
		error: undefined,
	},
	isLoggedIn: false,
	signIn: {
		status: 'idle',
		error: undefined,
	},
	signOut: {
		status: 'idle',
		error: undefined,
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		getLoggedStatus: (state) => {
			const jwt = localStorage.getItem(
				process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY
			);
			if (jwt !== null) {
				state.isLoggedIn = true;
				api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
				state.signIn.status = 'succeeded';
			} else {
				state.isLoggedIn = false;
				api.defaults.headers.common['Authorization'] = '';
				state.signIn.status = 'failed';
			}
		},
		signOut: (state) => {
			localStorage.removeItem(
				process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY
			);
			state.signOut.status = 'loading';
			api.defaults.headers.common['Authorization'] = '';
			state.signOut.status = 'succeeded';
			state.signOut.error = undefined;
			state.isLoggedIn = false;
			state.signIn.status = 'idle';
			state.signIn.error = undefined;
			state.user = {
				status: 'idle',
				error: undefined,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(signIn.pending, (state) => {
				state.signIn.status = 'loading';
			})
			.addCase(signIn.fulfilled, (state, action) => {
				localStorage.setItem(
					process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY,
					action.payload.accessToken
				);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${action.payload.accessToken}`;
				state.signIn.status = 'succeeded';
				state.isLoggedIn = true;
				state.signIn.error = undefined;
			})
			.addCase(signIn.rejected, (state, action) => {
				localStorage.removeItem(
					process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY
				);
				state.signIn.status = 'failed';
				state.signIn.error = action.payload.message;
			})
			.addCase(getUser.pending, (state) => {
				state.user.status = 'loading';
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.user = {
					...action.payload,
					status: 'succeeded',
					error: undefined,
				};
			})
			.addCase(getUser.rejected, (state, action) => {
				state.user = {
					status: 'failed',
					error: action.payload.message,
				};
			});
	},
});

const userReducer = userSlice.reducer;

export const { signOut, getLoggedStatus } = userSlice.actions;

export const selectSignInStatus = (state: RootState) => state.user.signIn;

export const selectUserStatus = (state: RootState) => ({
	status: state.user.user.status,
	error: state.user.user.error,
});

export const selectUser = (state: RootState): Partial<User> => {
	const { status, error, ...user } = state.user.user;
	return user;
};

export default userReducer;
