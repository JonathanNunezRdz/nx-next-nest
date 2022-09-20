import { HttpError, Status } from '@nx-next-nest/types';
import type { User } from '@prisma/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../api';
import userService from './service';

export interface UserState {
	user: User;
	signIn: {
		status: Status;
		error: string | undefined;
	};
}

export const signIn = createAsyncThunk<
	void,
	{ email: string; password: string },
	{ rejectValue: HttpError }
>('user/signIn', async ({ email, password }, thunkApi) => {
	try {
		const res = await userService.signIn(email, password);
		api.defaults.headers.common['Authorization'] = res.data.accessToken;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

const initialState: UserState = {
	user: {} as User,
	signIn: {
		status: 'idle',
		error: undefined,
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(signIn.pending, (state) => {
				state.signIn.status = 'loading';
			})
			.addCase(signIn.fulfilled, (state) => {
				state.signIn.status = 'succeeded';
			})
			.addCase(signIn.rejected, (state, action) => {
				state.signIn.status = 'failed';
				if ('length' in action.payload.message) {
				}
				state.signIn.error = action.payload.message;
			});
	},
});
