import {
	EditMediaResponse,
	EditMediaThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
import mediaService from '../service';

export const editMediaAction = createAsyncThunk<
	EditMediaResponse,
	EditMediaThunk,
	{ rejectValue: HttpError }
>('media/editMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.editMedia(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
