import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	HttpError,
	WaifuState,
} from '@nx-next-nest/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import waifuService from './service';

export const addWaifu = createAsyncThunk<
	CreateWaifuResponse,
	CreateWaifuDto,
	{ rejectValue: HttpError }
>('waifu/add', async (dto, thunkApi) => {
	try {
		const { data } = await waifuService.addWaifu(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
		}
		throw error;
	}
});

export const getAllWaifus = createAsyncThunk<
	GetAllWaifusResponse,
	GetAllWaifusDto,
	{ rejectValue: HttpError }
>('waifu/getAllWaifus', async (dto, thunkApi) => {
	try {
		const { data } = await waifuService.getAllWaifus(dto);
		return data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error as AxiosError<HttpError>;
			return thunkApi.rejectWithValue(response.data);
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
			});
	},
});

const waifuReducer = waifuSlice.reducer;

export const { resetAddWaifuStatus } = waifuSlice.actions;

export const selectAddWaifuStatus = (state: RootState) => state.waifu.add;

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
