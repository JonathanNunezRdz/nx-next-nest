import { Button, HStack, LinkBox, LinkOverlay, VStack } from '@chakra-ui/react';
import { EditMediaDto } from '@nx-next-nest/types';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NextLink from 'next/link';

import ProtectedPage from '../../components/auth/ProtectedPage';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import KnownAtInput from '../../components/common/KnownAtInput';
import PageTitle from '../../components/common/PageTitle';
import TitleInput from '../../components/common/TitleInput';
import TypeInput from '../../components/common/TypeInput';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	editMedia,
	resetGetMediaToEdit,
	selectEditMedia,
	selectEditMediaStatus,
} from '../../store/media';

import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';

const EditMedia = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const editMediaStatus = useAppSelector(selectEditMediaStatus);
	const mediaToEdit = useAppSelector(selectEditMedia);

	const formik = useFormik<EditMediaDto>({
		initialValues: {
			mediaId: mediaToEdit.mediaId,
			title: mediaToEdit.title,
			knownAt: formatDate(mediaToEdit.knownAt),
			type: mediaToEdit.type,
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				knownAt: prepareDate(values.knownAt),
			};
			const res = await dispatch(editMedia(newValues));
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		},
	});

	useEffect(() => {
		return () => {
			dispatch(resetGetMediaToEdit());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/media/edit'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='edit media' />
				<Form onSubmit={formik.handleSubmit}>
					{/* TODO: add loading */}
					<FormErrorMessageWrapper error={editMediaStatus.error} />
					<TitleInput
						title={formik.values.title}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isInvalid={
							formik.touched.title && !!formik.errors.title
						}
						error={formik.errors.title}
					/>
					<TypeInput
						type={formik.values.type}
						onChange={formik.handleChange}
					/>
					<KnownAtInput
						label={mediaLabel.present[formik.values.type]}
						onChange={formik.handleChange}
						knownAt={formik.values.knownAt}
					/>
					<HStack>
						<LinkBox display='inline-flex'>
							<NextLink href='/media' passHref>
								<LinkOverlay>
									<Button colorScheme='red'>cancel</Button>
								</LinkOverlay>
							</NextLink>
						</LinkBox>
						<Button
							type='submit'
							disabled={!formik.dirty}
							isLoading={editMediaStatus.status === 'loading'}
							colorScheme={formik.dirty ? 'green' : 'gray'}
						>
							confirm
						</Button>
					</HStack>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default EditMedia;
