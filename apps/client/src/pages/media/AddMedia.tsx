import { FormikErrors, useFormik } from 'formik';
import { useEffect } from 'react';
import { LinkBox, LinkOverlay, Button, HStack, VStack } from '@chakra-ui/react';
import { CreateMediaDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	addMedia,
	resetAddMediaStatus,
	selectAddMediaStatus,
} from '../../store/media';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';
import PageTitle from '../../components/common/PageTitle';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import TitleInput from '../../components/common/TitleInput';
import TypeInput from '../../components/common/TypeInput';
import KnownAtInput from '../../components/common/KnownAtInput';

const AddMedia = () => {
	const dispatch = useAppDispatch();
	const addMediaStatus = useAppSelector(selectAddMediaStatus);
	const router = useRouter();
	const formik = useFormik<CreateMediaDto>({
		initialValues: {
			title: '',
			type: 'anime',
			knownAt: formatDate(),
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				knownAt: prepareDate(values.knownAt),
			};
			const res = await dispatch(addMedia(newValues));
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		},
		validate: (values) => {
			const errors: FormikErrors<CreateMediaDto> = {};
			if (values.title === '') errors.title = 'title must not be empty';
			return errors;
		},
	});

	useEffect(() => {
		return () => {
			dispatch(resetAddMediaStatus());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add media' />
				<Form onSubmit={formik.handleSubmit}>
					{/* TODO: add loading */}
					<FormErrorMessageWrapper error={addMediaStatus.error} />
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
							isDisabled={!formik.dirty}
							isLoading={addMediaStatus.status === 'loading'}
							colorScheme={formik.dirty ? 'green' : 'gray'}
						>
							add media
						</Button>
					</HStack>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddMedia;
