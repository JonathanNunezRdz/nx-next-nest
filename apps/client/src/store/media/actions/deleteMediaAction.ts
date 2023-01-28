import { HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import mediaService from '../service';

// delete actions

export const deleteMediaAction = createAsyncThunk<
	void,
	{ mediaId: number | string },
	{ rejectValue: HttpError }
>('media/delete', async ({ mediaId }, { rejectWithValue }) => {
	try {
		await mediaService.deleteMedia(mediaId);
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
