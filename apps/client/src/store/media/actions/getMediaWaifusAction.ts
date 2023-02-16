import { getAxiosError } from '@client/src/utils';
import {
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	HttpError,
} from '@nx-next-nest/types';
import { Media } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

import mediaService from '../service';

export const getMediaWaifusAction = createAsyncThunk<
	GetMediaWaifusResponse,
	{ id: Media['id']; dto: GetMediaWaifusDto },
	{ rejectValue: HttpError }
>('media/getMediaWaifus', async ({ id, dto }, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaWaifus(id, dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
