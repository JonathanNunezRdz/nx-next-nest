import { getAxiosError } from '@client/src/utils';
import { GetAllUsersResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../service';

export const getAllUsersAction = createAsyncThunk<
	GetAllUsersResponse,
	void,
	{ rejectValue: HttpError }
>('user/getAll', async (_, { rejectWithValue }) => {
	try {
		const { data } = await userService.getAllUsers();
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
