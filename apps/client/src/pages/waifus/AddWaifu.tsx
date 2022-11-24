import { Button, HStack, LinkBox, LinkOverlay, VStack } from '@chakra-ui/react';
import { CreateWaifuDto } from '@nx-next-nest/types';
import { FormikErrors, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NextLink from 'next/link';

import ProtectedPage from '../../components/auth/ProtectedPage';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import MediaTitleInput from '../../components/common/MediaTitlesInput';
import NameInput from '../../components/common/NameInput';
import PageTitle from '../../components/common/PageTitle';
import WaifuLevelInput from '../../components/common/WaifuLevelInput';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMediaTitles,
	resetMediaTitles,
	selectMediaTitles,
	selectMediaTitlesStatus,
} from '../../store/media';
import { selectAuth } from '../../store/user';
import {
	addWaifu,
	resetAddWaifuStatus,
	selectAddWaifuStatus,
} from '../../store/waifu';

const AddWaifu = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const addWaifuStatus = useAppSelector(selectAddWaifuStatus);
	const mediaTitlesStatus = useAppSelector(selectMediaTitlesStatus);
	const mediaTitles = useAppSelector(selectMediaTitles);
	const router = useRouter();
	const formik = useFormik<CreateWaifuDto>({
		initialValues: {
			name: '',
			level: 'genin',
			mediaId: -1,
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				mediaId: Number(values.mediaId),
			};
			const res = await dispatch(addWaifu(newValues));
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
		},
		validate: (values) => {
			const errors: FormikErrors<CreateWaifuDto> = {};
			if (values.name === '') errors.name = 'name must not be empty';
			if (values.mediaId === -1) errors.mediaId = 'please choose a media';
			return errors;
		},
	});

	useEffect(() => {
		if (mediaTitlesStatus.status === 'idle' && isLoggedIn) {
			dispatch(getMediaTitles());
		}
	}, [dispatch, mediaTitlesStatus.status, isLoggedIn]);

	useEffect(() => {
		return () => {
			dispatch(resetAddWaifuStatus());
			dispatch(resetMediaTitles());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/waifus/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add waifu' />
				<Form onSubmit={formik.handleSubmit}>
					<FormErrorMessageWrapper error={addWaifuStatus.error} />
					<NameInput
						name={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isInvalid={formik.touched.name && !!formik.errors.name}
						error={formik.errors.name}
					/>
					<WaifuLevelInput
						level={formik.values.level}
						onChange={formik.handleChange}
					/>
					<MediaTitleInput
						mediaId={formik.values.mediaId}
						onChange={formik.handleChange}
						mediaTitles={mediaTitles}
					/>
					<HStack>
						<LinkBox display='inline-flex'>
							<NextLink href='/waifus' passHref>
								<LinkOverlay>
									<Button colorScheme='red'>cancel</Button>
								</LinkOverlay>
							</NextLink>
						</LinkBox>
						<Button
							type='submit'
							isDisabled={!formik.dirty}
							isLoading={addWaifuStatus.status === 'loading'}
							colorScheme={formik.dirty ? 'green' : 'gray'}
						>
							add waifu
						</Button>
					</HStack>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddWaifu;
