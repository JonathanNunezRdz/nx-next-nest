import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	selectEditLocalMediaStatus,
	selectEditServerMediaStatus,
} from '@client/src/store/media';
import { getMediaToEditFromServerAction } from '@client/src/store/media/actions';
import { selectUser, selectUserStatus } from '@client/src/store/user';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import EditMedia from './EditMedia';

const EditMediaWrapper = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const mediaId = router.query.mediaIdString as string;
	const localMediaStatus = useAppSelector(selectEditLocalMediaStatus);
	const serverMediaStatus = useAppSelector(selectEditServerMediaStatus);

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
