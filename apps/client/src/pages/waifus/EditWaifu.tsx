import { LinkBox, LinkOverlay, Button, HStack, VStack } from '@chakra-ui/react';
import { EditWaifuDto } from '@nx-next-nest/types';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import ProtectedPage from '../../components/auth/ProtectedPage';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import MediaTitleInput from '../../components/common/MediaTitlesInput';
import NameInput from '../../components/common/NameInput';
import PageTitle from '../../components/common/PageTitle';
import WaifuLevelInput from '../../components/common/WaifuLevelInput';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectMediaTitles } from '../../store/media';
import {
	editWaifu,
	selectEditWaifu,
	selectEditWaifuStatus,
} from '../../store/waifu';

const EditWaifu = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const editWaifuStatus = useAppSelector(selectEditWaifuStatus);
	const mediaTitles = useAppSelector(selectMediaTitles);
	const waifuToEdit = useAppSelector(selectEditWaifu);

	const formik = useFormik<EditWaifuDto>({
		initialValues: {
			waifuId: waifuToEdit.waifuId,
			name: waifuToEdit.name,
			level: waifuToEdit.level,
			mediaId: waifuToEdit.mediaId,
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				mediaId: Number(values.mediaId),
			};
			const res = await dispatch(editWaifu(newValues));
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
		},
	});

	return (
		<ProtectedPage originalUrl='/waifus/edit'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add waifu' />
				<Form onSubmit={formik.handleSubmit}>
					<FormErrorMessageWrapper error={editWaifuStatus.error} />
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
									<Button>cancel</Button>
								</LinkOverlay>
							</NextLink>
						</LinkBox>
						<Button
							type='submit'
							isDisabled={!formik.dirty}
							isLoading={editWaifuStatus.status === 'loading'}
						>
							confirm
						</Button>
					</HStack>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default EditWaifu;
