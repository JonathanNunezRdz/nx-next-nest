import {
	HttpError,
	SignInDto,
	SignInResponse,
	UserState,
} from '@nx-next-nest/types';
import type { User } from '@prisma/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import { invalidateJWT, setJWT, validateJWT } from '../../utils';
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
		data: undefined,
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
			const status = validateJWT();
			if (status.valid) {
				state.isLoggedIn = true;
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${status.jwt}`;
				state.signIn.status = 'succeeded';
			} else {
				state.isLoggedIn = false;
				api.defaults.headers.common['Authorization'] = '';
				state.signIn.status = 'failed';
			}
		},
		signOut: (state, action: PayloadAction<CallableFunction>) => {
			invalidateJWT();
			api.defaults.headers.common['Authorization'] = '';
			state = {
				...initialState,
				signOut: {
					...initialState.signOut,
					status: 'succeeded',
				},
			};
			if (action.payload) action.payload();
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
				state.isLoggedIn = true;
				state.signIn.error = undefined;
			})
			.addCase(signIn.rejected, (state, action) => {
				invalidateJWT();
				state.signIn.status = 'failed';
				state.signIn.error = action.payload.message;
				state.user = { ...initialState.user };
			})
			.addCase(getUser.pending, (state) => {
				state.user.status = 'loading';
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.user = {
					data: { ...action.payload },
					status: 'succeeded',
					error: undefined,
				};
			})
			.addCase(getUser.rejected, (state, action) => {
				state.user = {
					data: undefined,
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

export const selectUser = (state: RootState): User => state.user.user.data;

export default userReducer;
