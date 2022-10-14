import { AuthResponse, UserState } from '@nx-next-nest/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { setJWT } from '../../utils';

const initialState: UserState = {
	get: {
		data: null,
		checkedJWT: false,
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<AuthResponse>) => {
			setJWT(action.payload.accessToken);
			state.get.data = action.payload.user;
			state.get.checkedJWT = true;
		},
		setCredentialsChecked: (state) => {
			state.get.checkedJWT = true;
		},
	},
});

export const { setCredentials, setCredentialsChecked } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.get.data;
export const selectAuth = (state: RootState) => state.user.get;
