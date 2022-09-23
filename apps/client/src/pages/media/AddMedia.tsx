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
	VStack,
} from '@chakra-ui/react';
import { CreateMediaDto } from '@nx-next-nest/types';
import type { MediaType } from '@prisma/client';
import useProtectedPage from '../../utils/useProtectedPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMedia, selectAddMediaStatus } from '../../store/media';

const label: { [k in MediaType]: string } = {
	anime: 'watch',
	manga: 'read',
	videogame: 'play',
};

const formatDate = (dateString?: string) => {
	const date = dateString ? new Date(dateString) : new Date();

	const month =
		date.getUTCMonth() + 1 < 10
			? `0${date.getUTCMonth() + 1}`
			: `${date.getUTCMonth() + 1}`;
	const parsed = `${date.getUTCFullYear()}-${month}-${date.getUTCDate()}`;

	return parsed;
};

const AddMedia = () => {
	useProtectedPage({ originalUrl: '/media/add' });
	const dispatch = useAppDispatch();
	const addMediaStatus = useAppSelector(selectAddMediaStatus);
	const formik = useFormik<CreateMediaDto>({
		initialValues: {
			title: '',
			type: 'anime',
			knownAt: formatDate('2022-09-25T00:00:00.000Z'),
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				knownAt: new Date(values.knownAt).toISOString(),
			};
			await dispatch(addMedia(newValues));
		},
		validate: (values) => {
			const errors: FormikErrors<CreateMediaDto> = {};
			if (values.title === '') errors.title = 'Title must not be empty';
			return errors;
		},
	});

	console.log({ addMediaStatus });

	return (
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
							{/* TODO: finish add media form */}
							<FormControl
								isInvalid={
									!!formik.errors.title &&
									formik.touched.title
								}
							>
								<FormLabel htmlFor='title'>Title</FormLabel>
								<Input
									id='title'
									name='title'
									type='text'
									variant='filled'
									onChange={formik.handleChange}
									value={formik.values.title}
								/>
								<FormErrorMessage>
									{formik.errors.title}
								</FormErrorMessage>
							</FormControl>
							<FormControl>
								<FormLabel htmlFor='type'>Type</FormLabel>
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
									When did you {label[formik.values.type]} it?
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
								<Button type='submit'>Add media</Button>
							</Box>
						</VStack>
					</form>
				</Box>
			</VStack>
		</Box>
	);
};

export default AddMedia;
