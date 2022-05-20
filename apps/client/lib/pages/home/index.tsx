import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import SomeImage from '../../components/samples/SomeImage';
import SomeText from '../../components/samples/SomeText';

const Home: FC = () => {
	return (
		<Box
			display={{ md: 'flex' }}
			alignItems='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			<NextSeo title='home' />
			<SomeImage />
			<SomeText />
		</Box>
	);
};

export default Home;
