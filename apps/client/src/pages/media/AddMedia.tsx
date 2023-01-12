import { ChangeEvent, useEffect, useState } from 'react';
import {
	LinkBox,
	LinkOverlay,
	Button,
	HStack,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Image,
	FormErrorMessage,
	Select,
} from '@chakra-ui/react';
import { CreateMediaDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	addMedia,
	resetAddMediaStatus,
	selectAddMediaStatus,
} from '../../store/media';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { formatDate, loadImage, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';
import PageTitle from '../../components/common/PageTitle';
import FormErrorMessageWrapper from '../../components/common/FormErrorMessageWrapper';
import MediaTypeOptions from '../../components/common/MediaTypeOptions';

const AddMedia = () => {
	// redux
	const dispatch = useAppDispatch();
	const addMediaStatus = useAppSelector(selectAddMediaStatus);

	// next
	const router = useRouter();

	// hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	// react-hook-form
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
		setValue,
	} = useForm<CreateMediaDto>({
		defaultValues: {
			title: '',
			type: 'anime',
			knownAt: formatDate(),
			imageFormat: null,
		},
	});
	const onSubmit: SubmitHandler<CreateMediaDto> = async (data) => {
		const newValues = {
			...data,
			knownAt: prepareDate(data.knownAt),
			title: data.title.trim(),
		};
		let sendImage: File;

		// TODO: IMPORTANT! after saving to database, send image to server to upload from there

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const encodedImageName = encodeURIComponent(newValues.title);
			const completeFileName = `${encodedImageName}.${format}`;
			sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				addMedia({
					media: newValues,
					withImage: true,
					image: sendImage,
					path: completeFileName,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		} else {
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format);
	};

	useEffect(() => {
		return () => {
			dispatch(resetAddMediaStatus());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add media' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						{/* TODO: add loading */}
						<FormErrorMessageWrapper
							error={addMediaStatus.error?.message}
						/>
						<FormControl isInvalid={!!errors.title}>
							<FormLabel htmlFor='title'>title</FormLabel>
							<Input
								id='title'
								placeholder='title for your media'
								{...register('title', {
									required: 'title must not be empty',
								})}
							/>
							<FormErrorMessage>
								{errors.title?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='type'>type</FormLabel>
							<Select id='type' {...register('type')}>
								<MediaTypeOptions />
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='knownAt'>
								when did you {mediaLabel.present[watch('type')]}{' '}
								it?
							</FormLabel>
							<Input
								id='knownAt'
								type='date'
								{...register('knownAt')}
							/>
						</FormControl>

						{currentImage && <Image src={currentImage} />}
						<FormControl>
							<FormLabel htmlFor='image'>image</FormLabel>
							<Input
								id='image'
								name='image'
								type='file'
								variant='filled'
								accept='image/*'
								onChange={handleImageChange}
							/>
						</FormControl>
						<HStack>
							<LinkBox display='inline-flex'>
								<NextLink href='/media' passHref>
									<LinkOverlay>
										<Button colorScheme='red'>
											cancel
										</Button>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
							<Button
								type='submit'
								isDisabled={!isDirty}
								isLoading={addMediaStatus.status === 'loading'}
								colorScheme={isDirty ? 'green' : 'gray'}
							>
								add media
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddMedia;
