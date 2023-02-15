import { getAxiosError } from '@client/src/utils';
import {
	CreateWaifuResponse,
	CreateWaifuThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import waifuService from '../service';

export const addWaifuAction = createAsyncThunk<
	CreateWaifuResponse,
	CreateWaifuThunk,
	{ rejectValue: HttpError }
>('waifu/add', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.addWaifu(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
