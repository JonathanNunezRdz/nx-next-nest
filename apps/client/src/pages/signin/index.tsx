import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { type FC, useState } from 'react';
import Body from '../../components/layout/Body';

import { useAppDispatch } from '../../store/hooks';
import { signIn } from '../../store/user';

const SignIn: FC = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignIn = () => {
		dispatch(signIn({ email, password })).then((action) => {
			if (action.meta.requestStatus === 'fulfilled') {
				if (router.query.redirect) {
					router.push(router.query.redirect as string);
				} else {
					router.push('/');
				}
			}
		});
	};

	return (
		<Body>
			<NextSeo title='sign in' />
			<VStack px='1.5rem' py='1rem' spacing='1rem'>
				<FormControl>
					<FormLabel>Email address</FormLabel>
					<Input
						type='email'
						variant='filled'
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
				</FormControl>

				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input
						type='password'
						variant='filled'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</FormControl>

				<Box>
					<Button onClick={handleSignIn}>Sign In</Button>
				</Box>
			</VStack>
		</Body>
	);
};

export default SignIn;
