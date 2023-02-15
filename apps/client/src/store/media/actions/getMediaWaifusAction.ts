import { getAxiosError } from '@client/src/utils';
import {
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import mediaService from '../service';

export const getMediaWaifusAction = createAsyncThunk<
	GetMediaWaifusResponse,
	{ title: string; dto: GetMediaWaifusDto },
	{ rejectValue: HttpError }
>('media/getMediaWaifus', async ({ title, dto }, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaWaifus(title, dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
