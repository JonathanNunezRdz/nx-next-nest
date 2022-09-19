import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { FC } from 'react';

interface HeaderLinksProps {
	links: string[];
}

const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	return (
		<>
			{links.map((link) => {
				return (
					<NextLink key={link} href={`/${link}`} passHref>
						<Link me='1rem'>{link}</Link>
					</NextLink>
				);
			})}
			<NextLink href='/signin' passHref>
				<Link me='1rem'>sign in</Link>
			</NextLink>
		</>
	);
};

export default HeaderLinks;
