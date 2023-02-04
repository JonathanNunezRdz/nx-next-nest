import {
	CreateMediaResponse,
	CreateMediaThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
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
		const data = getAxiosError(error);
		return rejectWithValue(data);
	}
});
