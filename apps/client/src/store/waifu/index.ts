import { EditWaifuDto, WaifuState } from '@nx-next-nest/types';
import { User, Waifu } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';
import { addWaifuAction, editWaifuAction, getAllWaifusAction } from './actions';

const initialState: WaifuState = {
	get: {
		data: [],
		totalWaifus: 0,
		status: 'idle',
		error: undefined,
		appliedFilters: {
			page: 1,
			limit: 9,
			name: '',
			level: [],
			users: [],
		},
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
			action: PayloadAction<{ waifuId: Waifu['id']; userId: User['id'] }>
		) => {
			const { waifuId, userId } = action.payload;
			const index = state.get.data.findIndex(
				(elem) => elem.id === waifuId
			);

			if (
				waifuId === '-1' ||
				state.get.data.length === 0 ||
				index === -1
			) {
				state.edit.local.status = 'failed';
				state.edit.local.error = {
					message: 'waifuId not found in local data',
					error: '',
					statusCode: 418,
				};
			} else {
				const waifu = state.get.data[index];
				const isOwn = waifu.userId === userId;

				if (!isOwn) {
					state.edit.local.error = {
						message: `this waifu isn't yours`,
						error: '',
						statusCode: 403,
					};
				}
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
			.addCase(getAllWaifusAction.pending, (state) => {
				state.get.error = undefined;
				state.get.status = 'loading';
			})
			.addCase(getAllWaifusAction.fulfilled, (state, action) => {
				state.get.data = action.payload.waifus;
				state.get.totalWaifus = action.payload.totalWaifus;
				state.get.appliedFilters = action.meta.arg;
				state.get.error = undefined;
				state.get.status = 'succeeded';
			})
			.addCase(getAllWaifusAction.rejected, (state, action) => {
				state.get.error = action.payload;
				state.get.status = 'failed';
			})
			.addCase(addWaifuAction.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addWaifuAction.fulfilled, (state, action) => {
				state.get.data.unshift(action.payload);
				state.add.error = undefined;
				state.add.status = 'succeeded';
			})
			.addCase(addWaifuAction.rejected, (state, action) => {
				state.add.error = action.payload;
				state.add.status = 'failed';
			})
			.addCase(editWaifuAction.pending, (state) => {
				state.edit.error = undefined;
				state.edit.status = 'loading';
			})
			.addCase(editWaifuAction.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(waifu) => waifu.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
				state.edit.error = undefined;
				state.edit.status = 'succeeded';
			})
			.addCase(editWaifuAction.rejected, (state, action) => {
				state.edit.error = action.payload;
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
export const selectWaifuAppliedFilters = (state: RootState) => ({
	totalWaifus: state.waifu.get.totalWaifus,
	...state.waifu.get.appliedFilters,
});

export default waifuReducer;
