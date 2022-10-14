import { useMemo } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '.';
import { selectAuth } from './user';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
	const { data: user, checkedJWT } = useAppSelector(selectAuth);
	const isLoggedIn = !!user;

	return useMemo(
		() => ({ user, isLoggedIn, checkedJWT }),
		[user, isLoggedIn, checkedJWT]
	);
};
