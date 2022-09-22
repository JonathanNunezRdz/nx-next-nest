import {
	GetMediaDto,
	GetMediaResponse,
	HttpError,
	MediaState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import mediaService from './service';

export const getMedias = createAsyncThunk<
	GetMediaResponse[],
	GetMediaDto,
	{ rejectValue: HttpError }
>('media/getMedias', async (dto, thunkApi) => {
	try {
		const { data } = await mediaService.getMedias(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

const initialState: MediaState = {
	media: {
		data: [],
		status: 'idle',
		error: undefined,
	},
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getMedias.pending, (state) => {
				state.media.status = 'loading';
			})
			.addCase(getMedias.fulfilled, (state, action) => {
				state.media.status = 'succeeded';
				state.media.data.push(...action.payload);
				state.media.error = undefined;
			})
			.addCase(getMedias.rejected, (state, action) => {
				state.media.status = 'failed';
				state.media.error = action.payload.message;
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export default mediaReducer;
