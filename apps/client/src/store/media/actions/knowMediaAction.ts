import { getAxiosError } from '@client/src/utils';
import {
	HttpError,
	KnowMediaDto,
	KnowMediaResponse,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import mediaService from '../service';

// patch actions

export const knowMediaAction = createAsyncThunk<
	KnowMediaResponse,
	KnowMediaDto,
	{ rejectValue: HttpError }
>('media/knowMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.knownMedia(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
