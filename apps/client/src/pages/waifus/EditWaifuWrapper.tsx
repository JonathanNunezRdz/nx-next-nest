import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMediaTitles,
	getMediaToEditFromServer,
	resetMediaTitles,
	selectMediaTitlesStatus,
} from '../../store/media';
import { selectAuth, selectUser, selectUserStatus } from '../../store/user';
import {
	getWaifuToEditFromLocal,
	resetGetWaifuToEdit,
	selectEditLocalWaifuStatus,
	selectEditServerWaifuStatus,
	selectEditWaifu,
} from '../../store/waifu';
import { parseWaifuId } from '../../utils';
import EditWaifu from './EditWaifu';

const EditWaifuWrapper = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const waifuId = parseWaifuId(router.query.waifuIdString);
	const editWaifu = useAppSelector(selectEditWaifu);
	const localWaifuStatus = useAppSelector(selectEditLocalWaifuStatus);
	const serverWaifuStatus = useAppSelector(selectEditServerWaifuStatus);
	const mediaTitlesStatus = useAppSelector(selectMediaTitlesStatus);

	useEffect(() => {
		if (userStatus.status === 'succeeded' && router.isReady) {
			if (localWaifuStatus.status === 'idle') {
				dispatch(getWaifuToEditFromLocal({ waifuId, userId: user.id }));
			} else if (
				localWaifuStatus.status === 'failed' &&
				serverWaifuStatus.status === 'idle'
			) {
				dispatch(getMediaToEditFromServer(waifuId));
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
			dispatch(getMediaTitles());
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
