import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	GetMediaDto,
	GetMediaResponse,
	HttpError,
	KnowMediaDto,
	KnowMediaResponse,
	MediaState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import mediaService from './service';

export const knowMedia = createAsyncThunk<
	KnowMediaResponse,
	KnowMediaDto,
	{ rejectValue: HttpError }
>('media/knowMedia', async (dto, thunkApi) => {
	try {
		const { data } = await mediaService.knownMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

export const addMedia = createAsyncThunk<
	CreateMediaResponse,
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
	get: {
		data: [],
		status: 'idle',
		error: undefined,
	},
	add: {
		status: 'idle',
		error: undefined,
	},
	know: {
		status: 'idle',
		error: undefined,
	},
	edit: {
		local: {
			data: {} as EditMediaDto,
			status: 'idle',
			error: undefined,
		},
		server: {
			data: {} as EditMediaDto,
			status: 'idle',
			error: undefined,
		},
	},
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		resetAddStatus: (state) => {
			state.add.status = 'idle';
			state.add.error = undefined;
		},
		getMediaToEditFromLocal: (
			state,
			action: PayloadAction<{ mediaId: number; userId?: number }>
		) => {
			const { mediaId, userId } = action.payload;
			// TODO: get media from already loaded state, if there are no media loaded, get that one from server
			if (mediaId === -1) {
				state.edit.local.status = 'failed';
				state.edit.local.error = 'mediaId not found in local data';
			} else {
				const media = state.get.data.find(
					(elem) => elem.id === mediaId
				);
				state.edit.local.data.mediaId = media.id;
				state.edit.local.data.title = media.title;
				state.edit.local.data.type = media.type;
				state.edit.local.data.knownAt = new Date(
					media.knownBy.find((user) => user.userId === userId).knownAt
				).toISOString();
				state.edit.local.status = 'succeeded';
			}
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getMedias.pending, (state) => {
				state.get.status = 'loading';
			})
			.addCase(getMedias.fulfilled, (state, action) => {
				state.get.status = 'succeeded';
				state.get.data = action.payload;
				state.get.error = undefined;
			})
			.addCase(getMedias.rejected, (state, action) => {
				state.get.status = 'failed';
				state.get.error = action.payload.message;
			})
			.addCase(addMedia.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addMedia.fulfilled, (state, action) => {
				state.add.status = 'succeeded';
				state.get.data = [action.payload, ...state.get.data];
				state.add.error = undefined;
			})
			.addCase(addMedia.rejected, (state, action) => {
				state.add.status = 'failed';
				state.add.error = action.payload.message;
			})
			.addCase(knowMedia.pending, (state) => {
				state.know.status = 'loading';
				state.know.error = undefined;
			})
			.addCase(knowMedia.fulfilled, (state, action) => {
				state.know.status = 'succeeded';
				state.know.error = undefined;
				const index = state.get.data.findIndex(
					(media) => media.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
			})
			.addCase(knowMedia.rejected, (state, action) => {
				state.know.status = 'failed';
				state.know.error = action.payload.message;
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export const { resetAddStatus, getMediaToEditFromLocal } = mediaSlice.actions;

export const selectAddMediaStatus = (state: RootState) => state.media.add;

export const selectKnowMediaStatus = (state: RootState) => state.media.know;

export const selectEditLocalMedia = (state: RootState) =>
	state.media.edit.local;

export const selectMedia = (state: RootState) => state.media.get.data;

export default mediaReducer;
