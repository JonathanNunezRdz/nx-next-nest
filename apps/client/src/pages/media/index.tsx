import {
	Box,
	Center,
	Heading,
	HStack,
	IconButton,
	LinkBox,
	LinkOverlay,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import NextLink from 'next/link';

import { useAuth } from '../../store/hooks';
import MediaCard from './MediaCard';
import Body from '../../components/layout/Body';
import { NextSeo } from 'next-seo';
import { useGetMediaQuery } from '../../store';
import MediaGrid from './MediaGrid';

// TODO: design media filter options
// TODO: apply media pagination

const Media: FC = () => {
	const { isLoggedIn, user } = useAuth();

	const {
		data: mediaQuery,
		isSuccess,
		isLoading,
		isFetching,
		refetch,
	} = useGetMediaQuery({ limit: 9, page: 1 });

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
								onClick={refetch}
								isLoading={isFetching}
							/>
						</Box>
					</HStack>
				</Box>

				<Box w='full'>
					{isLoading ? (
						<Center>
							<Spinner />
						</Center>
					) : (
						<MediaGrid
							media={mediaQuery.data}
							isLoggedIn={isLoggedIn}
							ownId={isLoggedIn && user.id}
							isFetching={isFetching}
						/>
					)}
				</Box>
				<Center>
					<Text>More pages</Text>
				</Center>
			</VStack>
		</Body>
	);
};

export default Media;
