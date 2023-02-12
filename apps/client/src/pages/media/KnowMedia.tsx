import {
	Input,
	FormControl,
	FormLabel,
	VStack,
	Button,
	Text,
	LinkBox,
	LinkOverlay,
	HStack,
} from '@chakra-ui/react';
import { KnowMediaDto } from '@nx-next-nest/types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectKnowMediaStatus } from '@client/src/store/media';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
	formatDate,
	parseMediaId,
	parseMediaType,
	prepareDate,
} from '@client/src/utils';
import ProtectedPage from '@client/src/components/auth/ProtectedPage';
import PageTitle from '@client/src/components/common/PageTitle';
import { knowMediaAction } from '@client/src/store/media/actions';
import FormErrorMessageWrapper from '@client/src/components/common/FormErrorMessageWrapper';
import { mediaLabel } from '@client/src/utils/constants';

const KnowMedia = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const knowMediaStatus = useAppSelector(selectKnowMediaStatus);

	// next hooks
	const router = useRouter();
	const { mediaTitle, mediaTypeString, mediaIdString } = router.query;
	const mediaType = parseMediaType(mediaTypeString);
	const mediaId = parseMediaId(mediaIdString);

	// react hooks

	// react-hook-form
	const {
		register,
		handleSubmit,
		formState: { isDirty },
	} = useForm<KnowMediaDto>({
		defaultValues: {
			mediaId,
			knownAt: formatDate(),
		},
	});

	// functions
	const onSubmit: SubmitHandler<KnowMediaDto> = async (data) => {
		console.log('submitting knowMediaDto');

		const newValues = {
			...data,
			knownAt: prepareDate(data.knownAt),
		};

		const res = await dispatch(knowMediaAction(newValues));
		if (res.meta.requestStatus === 'fulfilled') router.push('/media');
	};

	// render
	if (!mediaType) return null;
	return (
		<ProtectedPage originalUrl='/media/know'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='know media'>
					<Text fontSize='1.5rem'>{mediaTitle}</Text>
				</PageTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						<FormErrorMessageWrapper
							error={knowMediaStatus.error?.message}
						/>

						<FormControl>
							<FormLabel htmlFor='knownAt'>
								when did you {mediaLabel.present[mediaType]} it?
							</FormLabel>
							<Input
								id='knownAt'
								type='date'
								max={formatDate()}
								{...register('knownAt')}
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
								isLoading={knowMediaStatus.status === 'loading'}
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

export default KnowMedia;
