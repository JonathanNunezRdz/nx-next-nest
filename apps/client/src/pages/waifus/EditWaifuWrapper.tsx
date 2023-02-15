import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	resetMediaTitles,
	selectMediaTitlesStatus,
} from '@client/src/store/media';
import { getMediaTitlesAction } from '@client/src/store/media/actions';
import {
	selectAuth,
	selectUser,
	selectUserStatus,
} from '@client/src/store/user';
import {
	getWaifuToEditFromLocal,
	selectEditLocalWaifuStatus,
	selectEditServerWaifuStatus,
	resetGetWaifuToEdit,
} from '@client/src/store/waifu';
import { getWaifuToEditFromServerAction } from '@client/src/store/waifu/actions';
import { parseWaifuId } from '@client/src/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import EditWaifu from './EditWaifu';

const EditWaifuWrapper = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	// const editWaifu = useAppSelector(selectEditWaifu);
	const localWaifuStatus = useAppSelector(selectEditLocalWaifuStatus);
	const serverWaifuStatus = useAppSelector(selectEditServerWaifuStatus);
	const mediaTitlesStatus = useAppSelector(selectMediaTitlesStatus);

	// next hooks
	const router = useRouter();
	const waifuId = parseWaifuId(router.query.waifuIdString);

	// react hooks
	useEffect(() => {
		if (userStatus.status === 'succeeded' && router.isReady) {
			if (localWaifuStatus.status === 'idle') {
				dispatch(getWaifuToEditFromLocal({ waifuId, userId: user.id }));
			} else if (
				localWaifuStatus.status === 'failed' &&
				serverWaifuStatus.status === 'idle'
			) {
				dispatch(getWaifuToEditFromServerAction(waifuId));
			}
		}
	}, [
		dispatch,
		waifuId,
		router.isReady,
		localWaifuStatus.status,
		serverWaifuStatus.status,
		userStatus.status,
		user.id,
	]);

	useEffect(() => {
		return () => {
			dispatch(resetGetWaifuToEdit());
			dispatch(resetMediaTitles());
		};
	}, [dispatch]);

	useEffect(() => {
		if (mediaTitlesStatus.status === 'idle' && isLoggedIn) {
			dispatch(getMediaTitlesAction());
		}
	}, [dispatch, mediaTitlesStatus.status, isLoggedIn]);

	if (
		(localWaifuStatus.status === 'succeeded' ||
			serverWaifuStatus.status === 'succeeded') &&
		mediaTitlesStatus.status === 'succeeded'
	)
		return <EditWaifu />;
	return null;
};

export default EditWaifuWrapper;
