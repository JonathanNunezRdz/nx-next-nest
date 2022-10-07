import { UserState } from '@nx-next-nest/types';
import { User } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { setJWT } from '../../utils';

const initialState: UserState = {
	get: {
		data: null,
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: User; token: string }>
		) => {
			setJWT(action.payload.token);
			state.get.data = action.payload.user;
		},
	},
});

export const { setCredentials } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.get.data;
