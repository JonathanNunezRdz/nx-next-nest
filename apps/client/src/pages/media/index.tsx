import {
	Box,
	Heading,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	SimpleGrid,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { FC, useEffect } from 'react';
import NextLink from 'next/link';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMedias, selectMedia } from '../../store/media';

// TODO: design media filter options

const Media: FC = () => {
	const dispatch = useAppDispatch();
	const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
	const media = useAppSelector(selectMedia);

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
								<Box
									key={element.id}
									bg='teal.500'
									borderRadius='md'
									p='1rem'
								>
									<Stat>
										<StatLabel>{element.type}</StatLabel>
										<StatNumber>{element.title}</StatNumber>
										{element.knownBy.map(
											({ user, knownAt }) => (
												<StatHelpText key={user.id}>
													{user.alias}
													{' - '}
													{new Date(
														knownAt
													).toDateString()}
												</StatHelpText>
											)
										)}
									</Stat>
								</Box>
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
