import {
	CreateMediaDto,
	GetMediaDto,
	GetMediaResponse,
	HttpError,
	MediaState,
	PostMediaResponse,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import mediaService from './service';

export const addMedia = createAsyncThunk<
	PostMediaResponse,
	CreateMediaDto,
	{ rejectValue: HttpError }
>('media/addMedia', async (dto, thunkApi) => {
	try {
		const { data } = await mediaService.addMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getMedias = createAsyncThunk<
	GetMediaResponse,
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
	data: [],
	status: 'idle',
	error: undefined,
	add: {
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
				state.status = 'loading';
			})
			.addCase(getMedias.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.data = action.payload;
				state.error = undefined;
			})
			.addCase(getMedias.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload.message;
			})
			.addCase(addMedia.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addMedia.fulfilled, (state, action) => {
				state.add.status = 'succeeded';
				state.data = [action.payload, ...state.data];
				state.add.error = undefined;
			})
			.addCase(addMedia.rejected, (state, action) => {
				state.add.status = 'failed';
				state.add.error = action.payload.message;
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export const selectAddMediaStatus = (state: RootState) => state.media.add;

export const selectMedia = (state: RootState) => state.media.data;

export default mediaReducer;
