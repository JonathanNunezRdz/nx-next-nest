import {
	Box,
	Input,
	FormControl,
	FormLabel,
	VStack,
	Button,
	Text,
} from '@chakra-ui/react';
import { KnowMediaDto } from '@nx-next-nest/types';
import { MediaType } from '@prisma/client';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

import Form from '../../components/common/Form';
import PageTitle from '../../components/common/PageTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { knowMedia, selectKnowMediaStatus } from '../../store/media';
import { formatDate, prepareDate } from '../../utils';
import { mediaLabel } from '../../utils/constants';
import ProtectedPage from '../../utils/ProtectedPage';

// TODO: change popover to a new page -> /media/know

const KnowMedia = () => {
	const dispatch = useAppDispatch();
	const knowMediaStatus = useAppSelector(selectKnowMediaStatus);
	const router = useRouter();
	const { mediaTitle, mediaTypeString, mediaIdString } = router.query;
	const mediaType = mediaTypeString as MediaType;
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
		<ProtectedPage originalUrl='/media/know'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='know media'>
					<Text fontSize='1.5rem'>{mediaTitle}</Text>
				</PageTitle>
				<Form onSubmit={formik.handleSubmit}>
					<Box color='red.300'>
						{knowMediaStatus.error &&
							(typeof knowMediaStatus.error === 'object' ? (
								knowMediaStatus.error.map((message) => (
									<Text key={message}>{message}</Text>
								))
							) : (
								<Text>{knowMediaStatus.error}</Text>
							))}
					</Box>
					<FormControl>
						<FormLabel htmlFor='knownAt'>
							when did you {mediaLabel.present[mediaType]} it?
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
						<Button type='submit'>confirm</Button>
					</Box>
				</Form>
			</VStack>
		</ProtectedPage>
	);
};

export default KnowMedia;
