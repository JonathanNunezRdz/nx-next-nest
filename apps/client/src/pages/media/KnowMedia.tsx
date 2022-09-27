import { CheckIcon } from '@chakra-ui/icons';
import {
	Box,
	IconButton,
	Input,
	FormControl,
	FormLabel,
	VStack,
	Heading,
} from '@chakra-ui/react';
import { KnowMediaDto } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

import Form from '../../components/common/Form';
import PageTitle from '../../components/common/PageTitle';
import { useAppDispatch } from '../../store/hooks';
import { knowMedia } from '../../store/media';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';
import ProtectedPage from '../../utils/ProtectedPage';

// TODO: change popover to a new page -> /media/know

const KnowMedia = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { mediaTitle, mediaType, mediaIdString } = router.query;
	const mediaId = parseInt(mediaIdString as string, 10);
	const formik = useFormik<KnowMediaDto>({
		initialValues: {
			mediaId,
			knownAt: formatDate(),
		},
		onSubmit: async (values) => {
			const newValues = {
				...values,
				knownAt: prepareDate(values.knownAt),
			};
			const res = await dispatch(knowMedia(newValues));
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		},
	});
	return (
		<Box minHeight='60vh' mb={8} w='full'>
			<ProtectedPage originalUrl='/media/know'>
				<VStack w='full' spacing='1rem'>
					<PageTitle title='know media'>
						<Heading size='lg'>- {mediaTitle}</Heading>
					</PageTitle>
					<Box>
						<form onSubmit={formik.handleSubmit}>
							<Form>
								<FormControl>
									<FormLabel htmlFor='knownAt'>
										when did you{' '}
										{
											mediaLabel.present[
												mediaType as MediaType
											]
										}{' '}
										it?
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
									<IconButton
										type='submit'
										aria-label='done'
										icon={<CheckIcon />}
										colorScheme='green'
									/>
								</Box>
							</Form>
						</form>
					</Box>
				</VStack>
			</ProtectedPage>
		</Box>
	);
};

export default KnowMedia;
