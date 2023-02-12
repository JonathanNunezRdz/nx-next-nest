import { getAxiosError } from '@client/src/utils';
import {
	EditWaifuResponse,
	EditWaifuThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import waifuService from '../service';

export const editWaifuAction = createAsyncThunk<
	EditWaifuResponse,
	EditWaifuThunk,
	{ rejectValue: HttpError }
>('waifu/edit', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.editWaifu(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
