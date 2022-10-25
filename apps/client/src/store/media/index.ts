import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	EditMediaResponse,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	HttpError,
	KnowMediaDto,
	KnowMediaResponse,
	MediaState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import mediaService from './service';

export const getMediaTitles = createAsyncThunk<
	GetMediaTitlesResponse,
	void,
	{ rejectValue: HttpError }
>('media/getMediatitles', async (_, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaTitles();
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const editMedia = createAsyncThunk<
	EditMediaResponse,
	EditMediaDto,
	{ rejectValue: HttpError }
>('media/editMedia', async (dto, thunkApi) => {
	try {
		const { data } = await mediaService.editMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getMediaToEditFromServer = createAsyncThunk<
	GetEditMediaResponse,
	number,
	{ rejectValue: HttpError }
>('media/getEditMedia', async (mediaId, thunkApi) => {
	try {
		const { data } = await mediaService.getEditMedia(mediaId);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

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
		totalPages: 0,
		currentPage: 0,
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
		data: {} as EditMediaDto,
		status: 'idle',
		error: undefined,
		local: {
			status: 'idle',
			error: undefined,
		},
		server: {
			status: 'idle',
			error: undefined,
		},
	},
	titles: {
		data: [],
		status: 'idle',
		error: undefined,
	},
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		resetGetMediaToEdit: (state) => {
			state.edit.data = {} as EditMediaDto;
			state.edit.local.status = 'idle';
			state.edit.local.error = undefined;
			state.edit.server.status = 'idle';
			state.edit.server.error = undefined;
		},
		resetAddMediaStatus: (state) => {
			state.add.status = 'idle';
			state.add.error = undefined;
		},
		getMediaToEditFromLocal: (
			state,
			action: PayloadAction<{ mediaId: number; userId: number }>
		) => {
			const { mediaId, userId } = action.payload;
			const index = state.get.data.findIndex(
				(elem) => elem.id === mediaId
			);

			if (mediaId === -1 || state.get.data.length === 0 || index === -1) {
				state.edit.local.status = 'failed';
				state.edit.local.error = 'mediaId not found in local data';
			} else {
				const media = state.get.data.find(
					(elem) => elem.id === mediaId
				);
				state.edit.data.mediaId = media.id;
				state.edit.data.title = media.title;
				state.edit.data.type = media.type;
				state.edit.data.knownAt = new Date(
					media.knownBy.find((user) => user.userId === userId).knownAt
				).toISOString();
				state.edit.local.status = 'succeeded';
			}
		},
		resetMediaTitles: (state) => {
			state.titles.data = [];
			state.titles.status = 'idle';
			state.titles.error = undefined;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getMedias.pending, (state) => {
				state.get.error = undefined;
				state.get.status = 'loading';
			})
			.addCase(getMedias.fulfilled, (state, action) => {
				state.get.data = action.payload.medias;
				state.get.totalPages = action.payload.totalPages;
				state.get.currentPage = action.meta.arg.page;
				state.get.error = undefined;
				state.get.status = 'succeeded';
			})
			.addCase(getMedias.rejected, (state, action) => {
				state.get.error = action.payload.message;
				state.get.status = 'failed';
			})
			.addCase(addMedia.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addMedia.fulfilled, (state, action) => {
				state.get.data = [action.payload, ...state.get.data];
				state.add.error = undefined;
				state.add.status = 'succeeded';
			})
			.addCase(addMedia.rejected, (state, action) => {
				state.add.error = action.payload.message;
				state.add.status = 'failed';
			})
			.addCase(knowMedia.pending, (state) => {
				state.know.error = undefined;
				state.know.status = 'loading';
			})
			.addCase(knowMedia.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(media) => media.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
				state.know.error = undefined;
				state.know.status = 'succeeded';
			})
			.addCase(knowMedia.rejected, (state, action) => {
				state.know.error = action.payload.message;
				state.know.status = 'failed';
			})
			.addCase(getMediaToEditFromServer.pending, (state) => {
				state.edit.server.error = undefined;
				state.edit.server.status = 'loading';
			})
			.addCase(getMediaToEditFromServer.fulfilled, (state, action) => {
				state.edit.data = action.payload;
				state.edit.server.error = undefined;
				state.edit.server.status = 'succeeded';
			})
			.addCase(getMediaToEditFromServer.rejected, (state, action) => {
				state.edit.server.error = action.payload.message;
				state.edit.server.status = 'failed';
			})
			.addCase(editMedia.pending, (state) => {
				state.edit.error = undefined;
				state.edit.status = 'loading';
			})
			.addCase(editMedia.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(media) => media.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}

				state.edit.error = undefined;
				state.edit.status = 'succeeded';
			})
			.addCase(editMedia.rejected, (state, action) => {
				state.edit.error = action.payload.message;
				state.edit.status = 'failed';
			})
			.addCase(getMediaTitles.pending, (state) => {
				state.titles.error = undefined;
				state.titles.status = 'loading';
			})
			.addCase(getMediaTitles.fulfilled, (state, action) => {
				state.titles.data = action.payload;
				state.titles.status = 'succeeded';
				state.titles.error = undefined;
			})
			.addCase(getMediaTitles.rejected, (state, action) => {
				state.titles.error = action.payload.message;
				state.titles.status = 'failed';
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export const {
	resetAddMediaStatus,
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	resetMediaTitles,
} = mediaSlice.actions;

export const selectAddMediaStatus = (state: RootState) => state.media.add;

export const selectKnowMediaStatus = (state: RootState) => state.media.know;

export const selectEditMedia = (state: RootState) => state.media.edit.data;
export const selectEditLocalMediaStatus = (state: RootState) =>
	state.media.edit.local;
export const selectEditServerMediaStatus = (state: RootState) =>
	state.media.edit.server;
export const selectEditMediaStatus = (state: RootState) => ({
	status: state.media.edit.status,
	error: state.media.edit.error,
});

export const selectMedia = (state: RootState) => state.media.get.data;
export const selectMediaStatus = (state: RootState) => ({
	status: state.media.get.status,
	error: state.media.get.error,
});
export const selectMediaPages = (state: RootState) => ({
	totalPages: state.media.get.totalPages,
	currentPage: state.media.get.currentPage,
});

export const selectMediaTitlesStatus = (state: RootState) => ({
	status: state.media.titles.status,
	error: state.media.titles.error,
});
export const selectMediaTitles = (state: RootState) => state.media.titles.data;

export default mediaReducer;
