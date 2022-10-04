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
import { useMediaId } from '../../utils';
import EditMedia from './EditMedia';

interface EditMediaProps {
	children: ReactNode;
}

const EditMediaWrapper = ({ children }: EditMediaProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const mediaId = useMediaId(router.query.mediaIdString);
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
		editMedia.knownAt,
		editMedia.mediaId,
		editMedia.title,
		editMedia.type,
		localMediaStatus.status,
		mediaId,
		router.isReady,
		serverMediaStatus.status,
		user.id,
		userStatus.status,
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
