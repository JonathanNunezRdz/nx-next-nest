import { Link, Spinner } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { selectAuth, selectUser, selectUserStatus } from '../../../store/user';

interface HeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: HeaderLinksProps) {
	// rtk hooks
	const user = useAppSelector(selectUser);
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { status } = useAppSelector(selectUserStatus);

	// sub components
	const LinkComponents = useMemo(() => {
		return links.map((link) => {
			return (
				<NextLink key={link} href={`/${link}`} passHref>
					<Link me='1rem'>{link}</Link>
				</NextLink>
			);
		});
	}, [links]);

	// render
	if (isLoggedIn && status === 'loading')
		return (
			<>
				{LinkComponents}
				<Spinner me='1rem' />
			</>
		);
	if (isLoggedIn && status === 'succeeded')
		return (
			<>
				{LinkComponents}
				<NextLink href='/user' passHref>
					<Link me='1rem'>{user.alias}</Link>
				</NextLink>
			</>
		);
	return (
		<>
			{LinkComponents}
			<NextLink href='/signin' passHref>
				<Link me='1rem'>sign in</Link>
			</NextLink>
		</>
	);
}

export default HeaderLinks;
