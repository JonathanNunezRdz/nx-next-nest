import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Text,
	VStack,
} from '@chakra-ui/react';
import { type FC, useState } from 'react';
import useBoundStore from '../../store';

const SignIn: FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { loggedIn, signIn, signOut } = useBoundStore((state) => ({
		loggedIn: state.loggedIn,
		signIn: state.signIn,
		signOut: state.signOut,
	}));
	const handleSignIn = () => {
		signIn(email, password);
	};
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
					{loggedIn ? (
						<Button bg='gray.700' onClick={signOut}>
							Sign Out
						</Button>
					) : (
						<Button bg='gray.700' onClick={handleSignIn}>
							Sign In
						</Button>
					)}
				</Box>
				<Box>
					<Text>Signed in: {loggedIn ? 'true' : 'false'}</Text>
				</Box>
			</VStack>
		</Box>
	);
};

export default SignIn;
