import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	selectEditLocalMediaStatus,
	selectEditServerMediaStatus,
} from '@client/src/store/media';
import { getMediaToEditFromServerAction } from '@client/src/store/media/actions';
import { selectUser, selectUserStatus } from '@client/src/store/user';
import { parseMediaId } from '@client/src/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import EditMedia from './EditMedia';

const EditMediaWrapper = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const localMediaStatus = useAppSelector(selectEditLocalMediaStatus);
	const serverMediaStatus = useAppSelector(selectEditServerMediaStatus);

	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaIdString);

	// react hooks
	useEffect(() => {
		if (userStatus.status === 'succeeded' && router.isReady) {
			if (localMediaStatus.status === 'idle') {
				dispatch(getMediaToEditFromLocal({ mediaId, userId: user.id }));
			} else if (
				localMediaStatus.status === 'failed' &&
				serverMediaStatus.status === 'idle'
			) {
				dispatch(getMediaToEditFromServerAction(mediaId));
			}
		}
	}, [
		dispatch,
		mediaId,
		router.isReady,
		localMediaStatus.status,
		serverMediaStatus.status,
		userStatus.status,
		user.id,
	]);

	useEffect(() => {
		return () => {
			dispatch(resetGetMediaToEdit());
		};
	}, [dispatch]);

	if (
		localMediaStatus.status === 'succeeded' ||
		serverMediaStatus.status === 'succeeded'
	)
		return <EditMedia />;

	return null;
};

export default EditMediaWrapper;
