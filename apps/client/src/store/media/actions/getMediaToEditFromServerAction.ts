import { GetEditMediaResponse, HttpError } from '@nx-next-nest/types';
import { Media } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
import mediaService from '../service';

export const getMediaToEditFromServerAction = createAsyncThunk<
	GetEditMediaResponse,
	Media['id'],
	{ rejectValue: HttpError }
>('media/getEditMedia', async (mediaId, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getEditMedia(mediaId);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
