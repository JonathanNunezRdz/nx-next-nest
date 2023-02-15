import {
	Box,
	Heading,
	HStack,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getMediaWaifusAction } from '@client/src/store/media/actions';
import { useAppDispatch, useAppSelector } from '@client/src/store/hooks';
import { selectAuth, selectUser } from '@client/src/store/user';
import {
	resetMediaWaifus,
	selectMediaWaifus,
	selectMediaWaifusStatus,
} from '@client/src/store/media';
import Body from '@client/src/components/layout/Body';
import WaifuCard from '../../waifus/WaifuCard';

const MediaWaifus = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const mediaTitle = router.query.mediaTitle;
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { id: ownId } = useAppSelector(selectUser);
	const { status } = useAppSelector(selectMediaWaifusStatus);
	const { waifus, mediaType } = useAppSelector(selectMediaWaifus);

	useEffect(() => {
		if (router.isReady) {
			if (status === 'idle') {
				dispatch(
					getMediaWaifusAction({
						title: mediaTitle as string,
						dto: {},
					})
				);
			}
		}
	}, [dispatch, mediaTitle, router.isReady, status]);

	useEffect(() => {
		return () => {
			dispatch(resetMediaWaifus());
		};
	}, [dispatch]);

	return (
		<Body h>
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
						<Box>
							<Heading>{mediaTitle}</Heading>
							<Text>
								{status === 'succeeded' ? mediaType : 'Loading'}
							</Text>
						</Box>
					</HStack>
				</Box>
				<Box w='full'>
					<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing='4'>
						{waifus.length > 0 ? (
							waifus.map((waifu) => (
								<WaifuCard
									key={waifu.id}
									waifu={waifu}
									ownId={ownId}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>
									no waifus have been added to this media
								</Text>
							</Box>
						)}
					</SimpleGrid>
				</Box>
			</VStack>
		</Body>
	);
};

export default MediaWaifus;
