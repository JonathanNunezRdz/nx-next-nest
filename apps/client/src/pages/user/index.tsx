import { Button, Heading, VStack } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, signOut } from '../../store/user';

const User: FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const router = useRouter();

	const handleSignOut = () => {
		dispatch(signOut(() => router.push('/signin')));
	};

	return (
		<Body>
			<NextSeo title='user' />
			<VStack>
				<Heading>profile - {user.alias}</Heading>
				<Button onClick={handleSignOut}>sign out</Button>
			</VStack>
		</Body>
	);
};

export default User;
