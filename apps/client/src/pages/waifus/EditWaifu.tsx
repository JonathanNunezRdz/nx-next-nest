import {
	LinkBox,
	LinkOverlay,
	Button,
	HStack,
	VStack,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Select,
	Image,
} from '@chakra-ui/react';
import { EditWaifuDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import {
	selectEditWaifu,
	selectEditWaifuStatus,
} from '@client/src/store/waifu';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatImageFileName, loadImage } from '@client/src/utils';
import { editWaifuAction } from '@client/src/store/waifu/actions';
import ProtectedPage from '@client/src/components/auth/ProtectedPage';
import PageTitle from '@client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@client/src/components/common/WaifuMediaTitleOptions';

function EditWaifu() {
	// redux hooks
	const dispatch = useAppDispatch();
	const editWaifuStatus = useAppSelector(selectEditWaifuStatus);
	const waifuToEdit = useAppSelector(selectEditWaifu);

	// next hooks
	const router = useRouter();

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	// react hook form
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isDirty, errors },
	} = useForm<EditWaifuDto>({
		defaultValues: {
			mediaId: waifuToEdit.mediaId,
			waifuId: waifuToEdit.id,
			name: waifuToEdit.name,
			level: waifuToEdit.level,
		},
	});

	// functions
	const onSubmit: SubmitHandler<EditWaifuDto> = async (data) => {
		console.log('submitting edit waifu');

		const newValues: EditWaifuDto = {
			...data,
			name: data.name?.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.name || waifuToEdit.name,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				editWaifuAction({ editDto: newValues, imageFile: sendImage })
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
		} else {
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				editWaifuAction({
					editDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
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
		<ProtectedPage originalUrl='/waifus/edit'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormErrorMessageWrapper
						error={editWaifuStatus.error?.message}
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
						<FormErrorMessage>
							{errors.name?.message}
						</FormErrorMessage>
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
							<NextLink href='/media' passHref>
								<LinkOverlay>
									<Button colorScheme='red'>cancel</Button>
								</LinkOverlay>
							</NextLink>
						</LinkBox>
						<Button
							type='submit'
							disabled={!isDirty}
							isLoading={editWaifuStatus.status === 'loading'}
							colorScheme={isDirty ? 'green' : 'gray'}
						>
							confirm
						</Button>
					</HStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
}

export default EditWaifu;
