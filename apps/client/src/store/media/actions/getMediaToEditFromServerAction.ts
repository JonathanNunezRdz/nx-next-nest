import { GetEditMediaResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import mediaService from '../service';

export const getMediaToEditFromServerAction = createAsyncThunk<
	GetEditMediaResponse,
	number,
	{ rejectValue: HttpError }
>('media/getEditMedia', async (mediaId, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getEditMedia(mediaId);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
