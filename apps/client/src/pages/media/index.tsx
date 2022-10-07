import {
	Box,
	Center,
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
import { FC, useCallback, useEffect } from 'react';
import NextLink from 'next/link';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getMedias,
	selectMedia,
	selectMediaPages,
	selectMediaStatus,
} from '../../store/media';
import MediaCard from './MediaCard';
import { selectUser } from '../../store/user';
import Body from '../../components/layout/Body';
import { NextSeo } from 'next-seo';

// TODO: design media filter options
// TODO: apply media pagination

const Media: FC = () => {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector((state) => state.user.auth);
	const media = useAppSelector(selectMedia);
	const mediaPages = useAppSelector(selectMediaPages);
	const user = useAppSelector(selectUser);
	const getMediaStatus = useAppSelector(selectMediaStatus);

	const handleGetMedia = useCallback(
		(page: number) => {
			dispatch(
				getMedias({
					page,
					limit: 9,
				})
			);
		},
		[dispatch]
	);

	useEffect(() => {
		handleGetMedia(1);
	}, [handleGetMedia]);

	return (
		<Body h>
			<NextSeo title='media' />
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
								onClick={() => handleGetMedia(1)}
								isLoading={getMediaStatus.status === 'loading'}
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
				<Center>
					<Text>More pages</Text>
				</Center>
			</VStack>
		</Body>
	);
};

export default Media;
