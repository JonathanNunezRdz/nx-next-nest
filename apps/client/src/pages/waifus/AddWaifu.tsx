import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Image,
	Input,
	LinkBox,
	LinkOverlay,
	Select,
	VStack,
} from '@chakra-ui/react';
import { CreateWaifuDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectAddWaifuStatus } from '@client/src/store/waifu';
import { addWaifuAction } from '@client/src/store/waifu/actions';
import ProtectedPage from '@client/src/components/auth/ProtectedPage';
import PageTitle from '@client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@client/src/components/common/WaifuMediaTitleOptions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatImageFileName, loadImage } from '@client/src/utils';

function AddWaifu() {
	// redux hooks
	const dispatch = useAppDispatch();
	const addWaifuStatus = useAppSelector(selectAddWaifuStatus);

	// next hooks
	const router = useRouter();

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	//react hook form
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isDirty },
	} = useForm<CreateWaifuDto>({
		defaultValues: {
			mediaId: '',
			name: '',
			level: 'genin',
		},
	});

	// functions
	const onSubmit: SubmitHandler<CreateWaifuDto> = async (data) => {
		console.log('submitting create waifu');
		const newValues: CreateWaifuDto = {
			...data,
			name: data.name.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.name,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				addWaifuAction({
					waifuDto: newValues,
					imageFile: sendImage,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		} else {
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				addWaifuAction({
					waifuDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format);
	};

	// render
	return (
		<ProtectedPage originalUrl='/waifus/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						<FormErrorMessageWrapper
							error={addWaifuStatus.error?.message}
						/>
						<FormControl isInvalid={Boolean(errors.name)}>
							<FormLabel htmlFor='name'>name</FormLabel>
							<Input
								id='name'
								placeholder='name for your waifu'
								{...register('name', {
									required: 'name must not be empty',
								})}
							/>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='level'>level</FormLabel>
							<Select id='level' {...register('level')}>
								<WaifuLevelOptions />
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='mediaId'>media</FormLabel>
							<Select id='mediaId' {...register('mediaId')}>
								<WaifuMediaTitleOptions />
							</Select>
						</FormControl>

						{currentImage && (
							// can use custom component <ImageCard />
							<Image src={currentImage} alt='upload image' />
						)}

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
								<NextLink
									href={
										typeof mediaId === 'string'
											? {
													pathname: '/media/waifus',
													query: { mediaId },
											  }
											: '/waifus'
									}
									passHref
								>
									<LinkOverlay>
										<Button colorScheme='red'>
											cancel
										</Button>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
							<Button
								type='submit'
								disabled={!isDirty}
								isLoading={addWaifuStatus.status === 'loading'}
								colorScheme={isDirty ? 'green' : 'gray'}
							>
								confirm
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
}

export default AddWaifu;
