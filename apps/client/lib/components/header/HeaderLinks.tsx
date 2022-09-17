import type { FC } from 'react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { useAppSelector } from '../../redux/hooks';

interface HeaderLinksProps {
	links: string[];
}

const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	const isLoggedIn = useAppSelector((state) => state.user.loggedIn);
	const alias = useAppSelector((state) => state.user.user.alias);
	return (
		<>
			{links.map((link) => {
				return (
					<NextLink key={link} href={link} passHref>
						<Link mr='1rem'>{link.split('/')[1]}</Link>
					</NextLink>
				);
			})}
			{isLoggedIn ? (
				<NextLink href={alias} passHref>
					<Link mr='1rem'>{alias}</Link>
				</NextLink>
			) : (
				<NextLink href='/signin' passHref>
					<Link mr='1rem'>sign in</Link>
				</NextLink>
			)}
		</>
	);
};

export default HeaderLinks;
