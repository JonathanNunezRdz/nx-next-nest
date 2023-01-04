import type { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { useAppSelector } from '../../store/hooks';
import Body from '../../components/layout/Body';
import { selectUser, selectUserStatus } from '../../store/user';

const Home: FC = () => {
	const { status } = useAppSelector(selectUserStatus);
	const user = useAppSelector(selectUser);
	const welcomeMessage = status === 'succeeded' ? user.alias : 'to the wia';

	return (
		<Body v h>
			<NextSeo title='home' />
			<Box>
				<Heading>welcome {welcomeMessage}</Heading>
			</Box>
		</Body>
	);
};

export default Home;
