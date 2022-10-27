import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	EditWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	HttpError,
	WaifuState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '..';
import waifuService from './service';

export const editWaifu = createAsyncThunk<
	EditWaifuResponse,
	EditWaifuDto,
	{ rejectValue: HttpError }
>('waifu/edit', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.editWaifu(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const addWaifu = createAsyncThunk<
	CreateWaifuResponse,
	CreateWaifuDto,
	{ rejectValue: HttpError }
>('waifu/add', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.addWaifu(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getAllWaifus = createAsyncThunk<
	GetAllWaifusResponse,
	GetAllWaifusDto,
	{ rejectValue: HttpError }
>('waifu/getAllWaifus', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.getAllWaifus(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return rejectWithValue(response.data);
		}
		throw error;
	}
});

const initialState: WaifuState = {
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
	edit: {
		data: {} as EditWaifuDto,
		server: {
			status: 'idle',
			error: undefined,
		},
		local: {
			status: 'idle',
			error: undefined,
		},
		status: 'idle',
		error: undefined,
	},
};

export const waifuSlice = createSlice({
	name: 'waifu',
	initialState,
	reducers: {
		resetAddWaifuStatus: (state) => {
			state.add.status = 'idle';
			state.add.error = undefined;
		},
		resetGetWaifuToEdit: (state) => {
			state.edit.data = {} as EditWaifuDto;
			state.edit.local.status = 'idle';
			state.edit.local.error = undefined;
			state.edit.server.status = 'idle';
			state.edit.server.error = undefined;
		},
		getWaifuToEditFromLocal: (
			state,
			action: PayloadAction<{ waifuId: number; userId: number }>
		) => {
			const { waifuId, userId } = action.payload;
			const index = state.get.data.findIndex(
				(elem) => elem.id === waifuId
			);

			if (waifuId === -1 || index === -1) {
				state.edit.local.status = 'failed';
				state.edit.local.error = 'waifuId not found in local data';
			} else {
				const waifu = state.get.data[index];
				state.edit.data.waifuId = waifu.id;
				state.edit.data.name = waifu.name;
				state.edit.data.level = waifu.level;
				state.edit.data.mediaId = waifu.mediaId;
				state.edit.local.error = undefined;
				state.edit.local.status = 'succeeded';
			}
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getAllWaifus.pending, (state) => {
				state.get.error = undefined;
				state.get.status = 'loading';
			})
			.addCase(getAllWaifus.fulfilled, (state, action) => {
				state.get.data = action.payload.waifus;
				state.get.totalPages = action.payload.totalPages;
				state.get.currentPage = action.meta.arg.page;
				state.get.error = undefined;
				state.get.status = 'succeeded';
			})
			.addCase(getAllWaifus.rejected, (state, action) => {
				state.get.error = action.payload.message;
				state.get.status = 'failed';
			})
			.addCase(addWaifu.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addWaifu.fulfilled, (state, action) => {
				state.get.data.unshift(action.payload);
				state.add.error = undefined;
				state.add.status = 'succeeded';
			})
			.addCase(addWaifu.rejected, (state, action) => {
				state.add.error = action.payload.message;
				state.add.status = 'failed';
			})
			.addCase(editWaifu.pending, (state) => {
				state.edit.error = undefined;
				state.edit.status = 'loading';
			})
			.addCase(editWaifu.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(waifu) => waifu.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
				state.edit.error = undefined;
				state.edit.status = 'succeeded';
			})
			.addCase(editWaifu.rejected, (state, action) => {
				state.edit.error = action.payload.message;
				state.edit.status = 'failed';
			});
	},
});

const waifuReducer = waifuSlice.reducer;

export const {
	resetAddWaifuStatus,
	getWaifuToEditFromLocal,
	resetGetWaifuToEdit,
} = waifuSlice.actions;

export const selectAddWaifuStatus = (state: RootState) => state.waifu.add;

export const selectEditWaifu = (state: RootState) => state.waifu.edit.data;
export const selectEditLocalWaifuStatus = (state: RootState) =>
	state.waifu.edit.local;
export const selectEditServerWaifuStatus = (state: RootState) =>
	state.waifu.edit.server;
export const selectEditWaifuStatus = (state: RootState) => ({
	status: state.waifu.edit.status,
	error: state.waifu.edit.error,
});

export const selectWaifus = (state: RootState) => state.waifu.get.data;
export const selectWaifuStatus = (state: RootState) => ({
	status: state.waifu.get.status,
	error: state.waifu.get.error,
});
export const selectWaifuPages = (state: RootState) => ({
	totalPages: state.waifu.get.totalPages,
	currentPage: state.waifu.get.currentPage,
});

export default waifuReducer;
