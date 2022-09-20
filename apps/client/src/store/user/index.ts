import type { User } from '@prisma/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UserSlice {
	user: User;
	loggedIn: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => void;
}

const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
	user: {} as User,
	loggedIn: false,
	signIn: async (email, password) => {
		try {
			await signIn(email, password);
			set(() => ({ loggedIn: true }));
		} catch (error) {
			if (isAxiosError<SignInError>(error)) {
				console.log(error.response.data.message);
			} else {
				console.error(error);
			}
		}
	},
	signOut: () => set(() => ({ loggedIn: false })),
});

export default createUserSlice;

export interface UserState {
	user: User;
	isLoggedIn: boolean;
}

export const getMedia = createAsyncThunk

const initialState: UserState = {
	user: {} as User,
	isLoggedIn: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.
	}
})