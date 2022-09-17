import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	useBoolean,
	VStack,
} from '@chakra-ui/react';
import { FC, useState } from 'react';

const index: FC = () => {
	const [email, setEmail] = useState('');
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
					<Input type='password' variant='filled' bg='teal.500' />
				</FormControl>

				<Box>
					<Button>Sign In</Button>
				</Box>
			</VStack>
		</Box>
	);
};

export default index;
