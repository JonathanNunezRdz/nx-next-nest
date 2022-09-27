import { Link, Spinner } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { FC } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { selectAuth, selectUser, selectUserStatus } from '../../../store/user';

interface HeaderLinksProps {
	links: string[];
}

const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useAppSelector(selectUser);
	const { status } = useAppSelector(selectUserStatus);
	const linksComponent = links.map((link) => {
		return (
			<NextLink key={link} href={`/${link}`} passHref>
				<Link me='1rem'>{link}</Link>
			</NextLink>
		);
	});
	if (isLoggedIn && status === 'loading')
		return (
			<>
				{linksComponent}
				<Spinner me='1rem' />
			</>
		);
	if (isLoggedIn && status === 'succeeded')
		return (
			<>
				{linksComponent}
				<NextLink href='/user' passHref>
					<Link me='1rem'>{user.alias}</Link>
				</NextLink>
			</>
		);
	return (
		<>
			{linksComponent}
			<NextLink href='/signin' passHref>
				<Link me='1rem'>sign in</Link>
			</NextLink>
		</>
	);
};

export default HeaderLinks;
