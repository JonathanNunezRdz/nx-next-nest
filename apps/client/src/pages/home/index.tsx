import type { FC, ReactNode } from 'react';
import {
	Box,
	Button,
	ButtonGroup,
	Heading,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { useAppSelector } from '../../store/hooks';
import Body from '../../components/layout/Body';
import { selectUser, selectUserStatus } from '../../store/user';
import { useGetMediaQuery } from '../../store/media/query';
import MediaCard from '../media/MediaCard';

const Home: FC = () => {
	const { status } = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);

	const {
		data: media,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetMediaQuery({ page: 1, limit: 9 });

	let content: ReactNode;

	if (isLoading) {
		content = <Spinner />;
	} else if (isSuccess) {
		content = (
			<Box>
				<SimpleGrid columns={2} spacing='1rem' my='1rem'>
					{media.medias.map((elem) => (
						<MediaCard
							isLoggedIn={!!user.id}
							media={elem}
							ownId={user.id}
							key={elem.id}
						/>
					))}
				</SimpleGrid>
			</Box>
		);
	} else if (isError) {
		content = <Text>{error.toString()}</Text>;
	}

	let pageButtons: ReactNode;

	if (isSuccess) {
		pageButtons = (
			<ButtonGroup isAttached>
				{Array.from({ length: media.totalPages }, (_, i) => (
					<Button key={i}>{i + 1}</Button>
				))}
			</ButtonGroup>
		);
	}

	return (
		<Body v h>
			<NextSeo title='home' />
			<VStack w='full' spacing='1rem'>
				<Box w='full' textAlign='center'>
					<Heading>
						welcome{' '}
						{status === 'succeeded' ? user.alias : 'to the wia'}
					</Heading>
				</Box>
				<Box w='full'>{content}</Box>
				<Box display='flex' w='full' justifyContent='center'>
					{pageButtons}
				</Box>
			</VStack>
		</Body>
	);
};

export default Home;
