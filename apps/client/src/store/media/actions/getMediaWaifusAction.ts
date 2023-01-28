import {
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
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
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
