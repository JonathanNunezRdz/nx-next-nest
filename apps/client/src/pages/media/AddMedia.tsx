import { FormikErrors, useFormik } from 'formik';
import { useEffect } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	VStack,
} from '@chakra-ui/react';
import { CreateMediaDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	addMedia,
	resetAddStatus,
	selectAddMediaStatus,
} from '../../store/media';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';
import PageTitle from '../../components/common/PageTitle';
import Form from '../../components/common/Form';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';

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
			dispatch(resetAddStatus());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add media' />
				<Form onSubmit={formik.handleSubmit}>
					{/* TODO: add loading */}
					<FormErrorMessageWrapper error={addMediaStatus.error} />
					<FormControl
						isInvalid={
							!!formik.errors.title && formik.touched.title
						}
						isRequired
					>
						<FormLabel htmlFor='title'>title</FormLabel>
						<Input
							id='title'
							name='title'
							type='text'
							variant='filled'
							onChange={formik.handleChange}
							value={formik.values.title}
							autoFocus
						/>
						<FormErrorMessage>
							{formik.errors.title}
						</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='type'>type</FormLabel>
						<Select
							id='type'
							name='type'
							variant='filled'
							onChange={formik.handleChange}
							value={formik.values.type}
						>
							<option value='anime'>anime</option>
							<option value='manga'>manga</option>
							<option value='videogame'>videogame</option>
						</Select>
					</FormControl>
					<FormControl>
						<FormLabel htmlFor='knownAt'>
							when did you{' '}
							{mediaLabel.present[formik.values.type]} it?
						</FormLabel>
						<Input
							id='knownAt'
							name='knownAt'
							type='date'
							variant='filled'
							onChange={formik.handleChange}
							value={formik.values.knownAt}
							max={formatDate()}
						/>
					</FormControl>
					<Box>
						<Button type='submit'>add media</Button>
					</Box>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddMedia;
