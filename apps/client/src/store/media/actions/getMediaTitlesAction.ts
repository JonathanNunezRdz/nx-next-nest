import { GetMediaTitlesResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import mediaService from '../service';

export const getMediaTitlesAction = createAsyncThunk<
	GetMediaTitlesResponse,
	void,
	{ rejectValue: HttpError }
>('media/getMediatitles', async (_, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaTitles();
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
