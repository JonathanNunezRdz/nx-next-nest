import { GetMediaDto, GetMediaResponse, HttpError } from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAxiosError } from '@client/src/utils';
import mediaService from '../service';

export const getMediasAction = createAsyncThunk<
	GetMediaResponse,
	GetMediaDto,
	{ rejectValue: HttpError }
>('media/getMedias', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMedias(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
