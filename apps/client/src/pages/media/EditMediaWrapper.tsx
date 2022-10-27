import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMediaToEditFromLocal,
	getMediaToEditFromServer,
	resetGetMediaToEdit,
	selectEditLocalMediaStatus,
	selectEditMedia,
	selectEditServerMediaStatus,
} from '../../store/media';
import { selectUser, selectUserStatus } from '../../store/user';
import { parseMediaId } from '../../utils';
import EditMedia from './EditMedia';

const EditMediaWrapper = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const mediaId = parseMediaId(router.query.mediaIdString);
	const editMedia = useAppSelector(selectEditMedia);
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
				dispatch(getMediaToEditFromServer(mediaId));
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
