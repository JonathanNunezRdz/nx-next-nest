import type { User } from '@prisma/client';
import { createSlice } from '@reduxjs/toolkit';

export type UserState = {
	user: User;
	loggedIn: boolean;
};

const initialState: UserState = {
	user: {} as User,
	loggedIn: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
});

export default userSlice.reducer;
