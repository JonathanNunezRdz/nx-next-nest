import type { FC, ReactNode } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
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
		content = media.medias.map((elem) => (
			<MediaCard
				isLoggedIn={!!user.id}
				media={elem}
				ownId={user.id}
				key={elem.id}
			/>
		));
	} else if (isError) {
		content = <Text>{error.toString()}</Text>;
	}

	return (
		<Body v h>
			<NextSeo title='home' />
			<Box>
				<Heading>
					welcome {status === 'succeeded' ? user.alias : 'to the wia'}
				</Heading>
				{content}
			</Box>
		</Body>
	);
};

export default Home;
