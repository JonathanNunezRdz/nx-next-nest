import React, { FC, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useAppSelector } from '../../store/hooks';
import SignedInHome from './SignedInHome';

const Home: FC = () => {
	const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

	useEffect(() => {
		console.log({
			env: localStorage.getItem(
				process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY
			),
		});
	}, []);
	return (
		<Box
			display={{ md: 'flex' }}
			alignItems='center'
			justifyContent='center'
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			<NextSeo title='home' />
			{isLoggedIn ? (
				<SignedInHome />
			) : (
				<Box>
					<Heading>Welcome user</Heading>
				</Box>
			)}
		</Box>
	);
};

export default Home;
