import { Text } from '@chakra-ui/react';
import { EditMediaDto } from '@nx-next-nest/types';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { useAppSelector } from '../../store/hooks';
import {
	getMediaToEditFromLocal,
	selectEditLocalMedia,
} from '../../store/media';
import { selectUser, selectUserStatus } from '../../store/user';
import { formatDate, useMediaId } from '../../utils';

const EditMedia = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const userStatus = useAppSelector(selectUserStatus);
	const mediaId = useMediaId(router.query.mediaIdString);
	const localMedia = useAppSelector(selectEditLocalMedia);

	const formik = useFormik<EditMediaDto>({
		initialValues: {
			mediaId,
			title: '',
			knownAt: formatDate(),
			type: 'anime',
		},
		onSubmit: (values) => {
			console.log(values);
		},
	});

	// TODO: get media from local and assign it lo formik, if not on local, get from server
	useEffect(() => {
		if (userStatus.status)
			if (localMedia.status === 'idle') {
				dispatch(getMediaToEditFromLocal({ mediaId, userId: user.id }));
			}
		if (localMedia.status === 'succeeded') {
			formik.setValues({
				mediaId: localMedia.data.mediaId,
				title: localMedia.data.title,
				knownAt: formatDate(localMedia.data.knownAt),
				type: localMedia.data.type,
			});
		}
	}, []);

	return (
		<ProtectedPage originalUrl='/media/edit'>
			<Text>Edit media</Text>
		</ProtectedPage>
	);
};

export default EditMedia;
