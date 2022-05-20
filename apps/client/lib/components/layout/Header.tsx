import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import ThemeToggle from './ThemeToggle';

const Header = () => {
	return (
		<Flex as='header' width='full' align='center'>
			<Heading as='h1' size='md'>
				<NextLink href='/' passHref>
					<Link>wia</Link>
				</NextLink>
			</Heading>
			<Box marginLeft='auto'>
				<NextLink href='media' passHref>
					<Link mr='1rem'>medias</Link>
				</NextLink>
				<NextLink href='media' passHref>
					<Link mr='1rem'>waifus</Link>
				</NextLink>
				<ThemeToggle />
			</Box>
		</Flex>
	);
};

export default Header;
