import {
	CreateMedia,
	CreateMediaResponse,
	EditMediaDto,
	EditMediaResponse,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	HttpError,
	KnowMediaDto,
	KnowMediaResponse,
	MediaState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { ref, uploadBytes } from 'firebase/storage';

import { RootState } from '..';
import { storage } from '../api/firebase';
import mediaService from './service';

export const deleteMedia = createAsyncThunk<
	void,
	{ mediaId: number | string },
	{ rejectValue: HttpError }
>('media/delete', async ({ mediaId }, { rejectWithValue }) => {
	try {
		await mediaService.deleteMedia(mediaId);
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getMediaWaifus = createAsyncThunk<
	GetMediaWaifusResponse,
	{ title: string; dto: GetMediaWaifusDto },
	{ rejectValue: HttpError }
>(
	'media/getMediaWaifus',
	async ({ title, dto }, { rejectWithValue, ...thunkApi }) => {
		try {
			const { data } = await mediaService.getMediaWaifus(title, dto);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const { response } = error as AxiosError<HttpError>;
				return rejectWithValue(response.data);
			}
			throw error;
		}
	}
);

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
>('media/editMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.editMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getMediaToEditFromServer = createAsyncThunk<
	GetEditMediaResponse,
	number,
	{ rejectValue: HttpError }
>('media/getEditMedia', async (mediaId, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getEditMedia(mediaId);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const knowMedia = createAsyncThunk<
	KnowMediaResponse,
	KnowMediaDto,
	{ rejectValue: HttpError }
>('media/knowMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.knownMedia(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const addMedia = createAsyncThunk<
	CreateMediaResponse,
	CreateMedia,
	{ rejectValue: HttpError }
>('media/addMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.addMedia(dto.media);
		if (dto.withImage) {
			const path =
				process.env.NODE_ENV === 'production'
					? dto.path
					: `test/${dto.path}`;
			console.log('firebase path', path);
			const imageRef = ref(storage, path);
			await uploadBytes(imageRef, dto.image);
		}
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		} else if (error instanceof FirebaseError) {
			console.log(error.code);
		}
		throw error;
	}
});

export const getMedias = createAsyncThunk<
	GetMediaResponse,
	GetMediaDto,
	{ rejectValue: HttpError }
>('media/getMedias', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMedias(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

const initialState: MediaState = {
	get: {
		data: [],
		totalMedias: 0,
		status: 'idle',
		error: undefined,
		appliedFilters: {
			page: 1,
			limit: 9,
			title: '',
			type: [],
			users: [],
		},
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
	delete: {
		error: undefined,
		status: 'idle',
	},
	titles: {
		data: [],
		status: 'idle',
		error: undefined,
	},
	mediaWaifus: {
		title: '',
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
		resetMediaWaifus: (state) => {
			state.mediaWaifus.title = '';
			state.mediaWaifus.data = [];
			state.mediaWaifus.error = undefined;
			state.mediaWaifus.status = 'idle';
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
				state.get.totalMedias = action.payload.totalMedias;
				state.get.appliedFilters = action.meta.arg;
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
			})
			.addCase(getMediaWaifus.pending, (state, action) => {
				state.mediaWaifus.status = 'loading';
				state.mediaWaifus.title = action.meta.arg.title;
				state.mediaWaifus.error = undefined;
			})
			.addCase(getMediaWaifus.fulfilled, (state, action) => {
				state.mediaWaifus.data = action.payload;
				state.mediaWaifus.error = undefined;
				state.mediaWaifus.status = 'succeeded';
			})
			.addCase(getMediaWaifus.rejected, (state, action) => {
				state.mediaWaifus.error = action.payload.message;
				state.mediaWaifus.status = 'failed';
			})
			.addCase(deleteMedia.pending, (state) => {
				state.delete.status = 'loading';
			})
			.addCase(deleteMedia.fulfilled, (state) => {
				state.delete.error = undefined;
				state.delete.status = 'succeeded';
			})
			.addCase(deleteMedia.rejected, (state, action) => {
				state.delete.error = action.payload.message;
				state.delete.status = 'failed';
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export const {
	resetAddMediaStatus,
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	resetMediaTitles,
	resetMediaWaifus,
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

export const selectDeleteMediaStatus = (state: RootState) => ({
	status: state.media.delete.status,
	error: state.media.delete.error,
});

export const selectMedia = (state: RootState) => state.media.get.data;
export const selectMediaStatus = (state: RootState) => ({
	status: state.media.get.status,
	error: state.media.get.error,
});
export const selectMediaAppliedFilters = (state: RootState) => ({
	totalMedias: state.media.get.totalMedias,
	appliedFilters: state.media.get.appliedFilters,
});

export const selectMediaTitlesStatus = (state: RootState) => ({
	status: state.media.titles.status,
	error: state.media.titles.error,
});
export const selectMediaTitles = (state: RootState) => state.media.titles.data;

export const selectMediaWaifus = (state: RootState) =>
	state.media.mediaWaifus.data;
export const selectMediaWaifusStatus = (state: RootState) => ({
	status: state.media.mediaWaifus.status,
	error: state.media.mediaWaifus.error,
});

export default mediaReducer;
