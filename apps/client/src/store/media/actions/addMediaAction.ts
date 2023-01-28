import {
	CreateMediaResponse,
	CreateMediaThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import mediaService from '../service';

export const addMediaAction = createAsyncThunk<
	CreateMediaResponse,
	CreateMediaThunk,
	{ rejectValue: HttpError }
>('media/addMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.addMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
