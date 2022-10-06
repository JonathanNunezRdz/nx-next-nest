import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from './media';

import userReducer from './user';
import waifuReducer from './waifu';

export const store = configureStore({
	reducer: {
		user: userReducer,
		media: mediaReducer,
		waifu: waifuReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
