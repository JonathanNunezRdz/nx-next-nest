import {
	Box,
	Heading,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { FC, useEffect } from 'react';
import NextLink from 'next/link';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMedias, selectMedia } from '../../store/media';
import MediaCard from './MediaCard';
import { selectUser } from '../../store/user';

// TODO: design media filter options

const Media: FC = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector((state) => state.user.auth);
	const media = useAppSelector(selectMedia);
	const user = useAppSelector(selectUser);

	const handleGetMedia = () => {
		dispatch(
			getMedias({
				cursor: new Date().toISOString(),
				limit: 10,
			})
		);
	};

	useEffect(() => {
		dispatch(
			getMedias({
				cursor: new Date().toISOString(),
				limit: 10,
			})
		);
	}, [dispatch]);

	return (
		<Box
			display='flex'
			justifyContent='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			<VStack w='full' spacing='1rem'>
				<Box w='full'>
					<HStack spacing='1rem'>
						<Heading>media</Heading>

						{isLoggedIn && (
							<LinkBox>
								<NextLink href='/media/add' passHref>
									<LinkOverlay>
										<IconButton
											aria-label='add media'
											icon={<AddIcon />}
											size='sm'
											mt={1}
										/>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
						)}
						<Box>
							<IconButton
								aria-label='refresh media'
								icon={<RepeatIcon />}
								size='sm'
								mt={1}
								onClick={handleGetMedia}
							/>
						</Box>
					</HStack>
				</Box>

				<Box w='full'>
					<SimpleGrid
						columns={{ sm: 1, md: 2, lg: 3 }}
						spacing='1rem'
					>
						{media.length > 0 ? (
							media.map((element) => (
								<MediaCard
									key={element.id}
									media={element}
									ownId={user.id}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>no media has been added to the wia</Text>
							</Box>
						)}
					</SimpleGrid>
				</Box>
			</VStack>
		</Box>
	);
};

export default Media;
