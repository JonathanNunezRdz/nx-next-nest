import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	resetMediaTitles,
	selectMediaTitlesStatus,
} from '@client/src/store/media';
import { getMediaTitlesAction } from '@client/src/store/media/actions';
import { selectAuth } from '@client/src/store/user';
import { resetAddWaifuStatus } from '@client/src/store/waifu';
import { useEffect } from 'react';
import AddWaifu from './AddWaifu';

export default function AddWaifuWrapper() {
	// redux hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const mediaTitlesStatus = useAppSelector(selectMediaTitlesStatus);

	// react hooks
	useEffect(() => {
		return () => {
			dispatch(resetAddWaifuStatus());
			dispatch(resetMediaTitles());
		};
	}, [dispatch]);

	useEffect(() => {
		if (mediaTitlesStatus.status === 'idle' && isLoggedIn) {
			dispatch(getMediaTitlesAction());
		}
	}, [dispatch, mediaTitlesStatus.status, isLoggedIn]);

	return <AddWaifu />;
}
