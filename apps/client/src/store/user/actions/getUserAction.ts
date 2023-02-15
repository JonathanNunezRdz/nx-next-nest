import { getAxiosError } from '@client/src/utils';
import { GetUserResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../service';

// get actions

export const getUserAction = createAsyncThunk<
	GetUserResponse,
	void,
	{ rejectValue: HttpError }
>('user/getUser', async (_, { rejectWithValue }) => {
	try {
		const { data } = await userService.getUser();
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
