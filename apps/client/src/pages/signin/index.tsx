import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Text,
	VStack,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { type FC, useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getUser,
	selectSignInStatus,
	selectUserStatus,
	signIn,
	signOut,
} from '../../store/user';

const SignIn: FC = () => {
	const dispatch = useAppDispatch();
	const signInStatus = useAppSelector(selectSignInStatus);
	const userStatus = useAppSelector(selectUserStatus);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignIn = () => {
		dispatch(signIn({ email, password }));
	};

	const handleSignOut = () => {
		dispatch(signOut());
	};

	useEffect(() => {
		if (
			signInStatus.status === 'succeeded' &&
			userStatus.status === 'idle'
		) {
			dispatch(getUser());
		}
	}, [signInStatus.status, userStatus.status, dispatch]);

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
			<NextSeo title='sign in' />
			<VStack
				bg='teal.400'
				borderRadius='lg'
				px='1.5rem'
				py='1rem'
				spacing='1rem'
			>
				<FormControl>
					<FormLabel>Email address</FormLabel>
					<Input
						type='email'
						variant='filled'
						bg='teal.500'
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input
						type='password'
						variant='filled'
						bg='teal.500'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</FormControl>

				<Box>
					{signInStatus.status === 'succeeded' ? (
						<Button bg='gray.700' onClick={handleSignOut}>
							Sign Out
						</Button>
					) : (
						<Button bg='gray.700' onClick={handleSignIn}>
							Sign In
						</Button>
					)}
				</Box>
				<Box>
					<Text>
						Signed in:{' '}
						{signInStatus.status === 'succeeded' ? 'true' : 'false'}
					</Text>
				</Box>
			</VStack>
		</Box>
	);
};

export default SignIn;
