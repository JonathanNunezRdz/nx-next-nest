import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { FC } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { selectUser, selectUserStatus } from '../../../store/user';

interface HeaderLinksProps {
	links: string[];
}

const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
	const user = useAppSelector(selectUser);
	const { status } = useAppSelector(selectUserStatus);
	return (
		<>
			{links.map((link) => {
				return (
					<NextLink key={link} href={`/${link}`} passHref>
						<Link me='1rem'>{link}</Link>
					</NextLink>
				);
			})}
			{isLoggedIn && status === 'succeeded' ? (
				<NextLink href='/user' passHref>
					<Link me='1rem'>{user.alias}</Link>
				</NextLink>
			) : (
				<NextLink href='/signin' passHref>
					<Link me='1rem'>sign in</Link>
				</NextLink>
			)}
		</>
	);
};

export default HeaderLinks;
