import { FormikErrors, useFormik } from 'formik';
import { Box, Button, VStack } from '@chakra-ui/react';
import { CreateMediaDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';

import ProtectedPage from '../../components/auth/ProtectedPage';
import { formatDate, prepareDate, mediaLabel } from '../../utils';
import PageTitle from '../../components/common/PageTitle';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import TitleInput from '../../components/common/TitleInput';
import TypeInput from '../../components/common/TypeInput';
import KnownAtInput from '../../components/common/KnownAtInput';
import { useAddMediaMutation } from '../../store';

const AddMedia = () => {
	const router = useRouter();
	const [addMedia, { isLoading, isError, error, isSuccess }] =
		useAddMediaMutation();

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

			await addMedia(newValues);
			if (isSuccess) router.push('/media');
		},
		validate: (values) => {
			const errors: FormikErrors<CreateMediaDto> = {};
			if (values.title === '') errors.title = 'title must not be empty';
			return errors;
		},
	});

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add media' />
				<Form onSubmit={formik.handleSubmit}>
					<FormErrorMessageWrapper error={error} />
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
					<Box>
						<Button
							type='submit'
							disabled={!formik.dirty}
							isLoading={isLoading}
						>
							add media
						</Button>
					</Box>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddMedia;
