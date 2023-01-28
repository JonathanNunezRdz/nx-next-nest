import {
	EditMediaResponse,
	EditMediaThunk,
	HttpError,
} from '@nx-next-nest/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
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
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response!.data);
		}
		throw error;
	}
});
