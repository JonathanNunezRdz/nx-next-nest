import { HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
import { Media } from '@prisma/client';
import mediaService from '../service';

// delete actions

export const deleteMediaAction = createAsyncThunk<
	void,
	{ mediaId: Media['id'] },
	{ rejectValue: HttpError }
>('media/delete', async ({ mediaId }, { rejectWithValue }) => {
	try {
		await mediaService.deleteMedia(mediaId);
	} catch (error) {
		const data = getAxiosError(error);
		return rejectWithValue(data);
	}
});
