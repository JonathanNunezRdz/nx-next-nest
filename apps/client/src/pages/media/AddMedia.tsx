import { FormikErrors, useFormik } from 'formik';
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	HStack,
	Input,
	Select,
	Text,
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
import ProtectedPage from '../../utils/ProtectedPage';
import { useEffect } from 'react';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';

const AddMedia = () => {
	const dispatch = useAppDispatch();
	const addMediaStaus = useAppSelector(selectAddMediaStatus);
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
			<Box minHeight='60vh' mb={8} w='full'>
				<VStack w='full' spacing='1rem'>
					<Box w='full'>
						<HStack spacing='1rem'>
							<Heading>add media</Heading>
						</HStack>
					</Box>

					<Box>
						<form onSubmit={formik.handleSubmit}>
							<VStack px='1.5rem' py='1rem' spacing='1rem'>
								{/* TODO: add loading */}
								<Box color='red.300'>
									{addMediaStaus.error &&
										(typeof addMediaStaus.error ===
										'object' ? (
											addMediaStaus.error.map(
												(message) => (
													<Text key={message}>
														{message}
													</Text>
												)
											)
										) : (
											<Text>{addMediaStaus.error}</Text>
										))}
								</Box>
								<FormControl
									isInvalid={
										!!formik.errors.title &&
										formik.touched.title
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
										<option value='videogame'>
											videogame
										</option>
									</Select>
								</FormControl>
								<FormControl>
									<FormLabel htmlFor='knownAt'>
										when did you{' '}
										{mediaLabel.present[formik.values.type]}{' '}
										it?
									</FormLabel>
									<Input
										id='knownAt'
										name='knownAt'
										type='date'
										variant='filled'
										onChange={formik.handleChange}
										value={formik.values.knownAt}
									/>
								</FormControl>
								<Box>
									<Button type='submit'>add media</Button>
								</Box>
							</VStack>
						</form>
					</Box>
				</VStack>
			</Box>
		</ProtectedPage>
	);
};

export default AddMedia;
