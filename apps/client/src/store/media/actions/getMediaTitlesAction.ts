import { GetMediaTitlesResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
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
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
