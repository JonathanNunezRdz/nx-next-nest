import { Link, Spinner } from '@chakra-ui/react';
import { useUserQuery } from '../../../store';
import NextLink from 'next/link';
import type { FC } from 'react';

import { useAuth } from '../../../store/hooks';

interface HeaderLinksProps {
	links: string[];
}

const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	const { isLoggedIn, user } = useAuth();
	const { isLoading: userIsLoading } = useUserQuery();
	const linksComponent = links.map((link) => {
		return (
			<NextLink key={link} href={`/${link}`} passHref>
				<Link me='1rem'>{link}</Link>
			</NextLink>
		);
	});
	if (userIsLoading)
		return (
			<>
				{linksComponent}
				<Spinner me='1rem' />
			</>
		);
	if (isLoggedIn)
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
