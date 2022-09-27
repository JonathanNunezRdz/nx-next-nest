import { Button, Heading, VStack } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import type { FC } from 'react';

import Body from '../../components/layout/Body';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, signOut } from '../../store/user';
import ProtectedPage from '../../utils/ProtectedPage';

const User: FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const handleSignOut = () => {
		dispatch(signOut());
	};

	return (
		<Body>
			<ProtectedPage originalUrl='/user'>
				<NextSeo title='user' />
				<VStack>
					<Heading>profile - {user.alias}</Heading>
					<Button onClick={handleSignOut}>sign out</Button>
				</VStack>
			</ProtectedPage>
		</Body>
	);
};

export default User;
